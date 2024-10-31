import {
	IPayloadEpitopeMap,
	IPayloadGlobalAlignment,
	IPayloadLocalAlignment,
	IWork,
	workStatus,
	workType,
} from "@vsdbmv2/mapping-library";
import { mappingUpdate } from "../controllers/cronController";
import { v4 as uuid } from "uuid";
import knex from "../services/database";

export class Work implements IWork {
	public status: workStatus;
	public type;
	public id1: number;
	public id2?: number;
	public idSubtype?: number | undefined;
	public sequence1: string;
	public sequence2?: string;
	public epitopes: string[];
	public workerId: string | undefined;
	public identifier: string;
	public payload?: IPayloadGlobalAlignment | IPayloadLocalAlignment | IPayloadEpitopeMap;
	next: IWork | undefined;
	startTime: number;
	endTime: number;
	organism: string;

	constructor(
		type: workType,
		organism: string,
		sequence1: string,
		id1: number,
		sequence2: string | string[],
		id2?: number,
		idSubtype?: number
	) {
		this.type = type;
		this.status = "TODO";
		this.epitopes = [];
		this.sequence1 = sequence1;
		this.id1 = id1;
		this.organism = organism;
		if (id2) this.id2 = id2;
		if (idSubtype) this.idSubtype = idSubtype;
		if (type === "global-mapping" || type === "local-mapping") this.sequence2 = sequence2 as string;
		if (type === "epitope-mapping") this.epitopes = sequence2 as string[];
		this.identifier = uuid();
		this.startTime = 0;
		this.endTime = 0;
	}

	allocate(worker_id: string) {
		this.workerId = worker_id;
		this.status = "ALLOCATED";
		this.startTime = new Date().getTime();
	}

	deallocate() {
		this.workerId = undefined;
		this.status = "TODO";
		this.startTime = 0;
		this.endTime = 0;
	}

	demand() {
		// TODO
	}

	done() {
		this.status = "DONE";
		this.endTime = new Date().getTime();
	}
}

class TaskManager {
	private queue: Work[];
	private doing: Work[];
	private isBusy = false;
	private hashWork: Set<string>;
	private worksTypeDoing: {
		[key: string]: number;
	} = {
		"global-mapping": 0,
		"local-mapping": 0,
		"epitope-mapping": 0,
	};

	constructor() {
		this.queue = [];
		this.doing = [];
		this.hashWork = new Set();
	}

	get size(): number {
		return this.queue.length;
	}
	get sizeDoing(): number {
		return this.doing.length;
	}

	registerWork(
		type: workType,
		organism: string,
		sequence1: string,
		id1: number,
		sequence2: string | string[],
		id2?: number,
		idSubtype?: number
	) {
		let key = `${organism}_${type}_${id1}_${id2}`;
		if (idSubtype) key += `_${idSubtype}`;
		if (this.hashWork.has(key)) return;
		const work = new Work(type, organism, sequence1, id1, sequence2, id2, idSubtype);
		this.queue.push(work);
		this.hashWork.add(key);
		this.worksTypeDoing[type]++;
	}

	async addWorkHashMap(organism: string, type: string, id1: number, id2: number | string, idSubtype?: number) {
		this.hashWork.add(`${organism}_${type}_${id1}_${id2}${idSubtype ? `_${idSubtype}` : ""}`);
		this.worksTypeDoing[type]++;
	}
	async removeWorkHashMap(organism: string, type: string, id1: number, id2: number | string, idSubtype?: number) {
		this.hashWork.delete(`${organism}_${type}_${id1}_${id2}${idSubtype ? `_${idSubtype}` : ""}`);
		this.worksTypeDoing[type]--;
	}
	async clearWorkHashMap() {
		this.hashWork.clear();
		Object.keys(this.worksTypeDoing).forEach((key) => (this.worksTypeDoing[key] = 0));
	}

	async getWork(worker_id: string, worksAmount: number): Promise<Work[]> {
		while (this.isBusy) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		this.isBusy = true;
		const works: Work[] = [];
		while (works.length < worksAmount && this.queue.length) {
			works.push(this.queue.pop() as Work);
		}
		if (works.length > 0) {
			works.forEach((work: Work) => {
				work.workerId = worker_id;
				work.status = "ALLOCATED";
			});
			this.doing.push(...works);
		}
		this.isBusy = false;
		return works;
	}

	async getWorksLeft() {
		while (this.isBusy) await new Promise((resolve) => setTimeout(resolve, 100));
		return this.queue.length;
	}
	async getDoingSize() {
		while (this.isBusy) await new Promise((resolve) => setTimeout(resolve, 100));
		return this.doing.length;
	}
	async getWorkDoingSize(type: workType) {
		while (this.isBusy) await new Promise((resolve) => setTimeout(resolve, 100));
		return this.worksTypeDoing[type];
	}

	deallocateWork(worker_id: string) {
		const works: Work[] = this.doing.filter((work: Work) => work.workerId === worker_id);
		this.doing = this.doing.filter((work: Work) => work.workerId !== worker_id);
		if (works.length > 0) {
			this.queue.push(...works.map((work: Work) => ({ ...work, status: "TODO" } as Work)));
			works.forEach((work) => this.worksTypeDoing[work.type]--);
		}
	}

	async finishWork(finishedWork: Work[]) {
		const ids = finishedWork.map((work: Work) => work.identifier);

		// TODO: BULK INSERT LOGIC
		// finishedWork.forEach((work) => this.worksTypeDoing[work.type]--);

		this.doing = this.doing.filter((work: Work) => !ids.includes(work.identifier));
		const organisms = finishedWork
			.map((work: Work) => work.payload?.organism as string)
			.filter((organism: string, index: number, arr: string[]) => arr.indexOf(organism) === index);
		for (const organism of organisms) {
			const finishedGlobalMapping = finishedWork.filter(
				(work: Work) => work.type === "global-mapping" && work.payload?.organism === organism
			);
			const finishedLocalMapping = finishedWork.filter(
				(work: Work) => work.type === "local-mapping" && work.payload?.organism === organism
			);
			await Promise.all([
				...(finishedGlobalMapping.length
					? [
							knex
								.withSchema(organism)
								.table("sequence_map")
								.insert(
									finishedGlobalMapping.map((work: Work) => ({
										idsequence: (work.payload as IPayloadGlobalAlignment).idSequence,
										map_init: (work.payload as IPayloadGlobalAlignment).map_init,
										map_end: (work.payload as IPayloadGlobalAlignment).map_end,
										coverage_pct: (work.payload as IPayloadGlobalAlignment).coverage_pct,
									}))
								),
					  ]
					: []),
				...(finishedLocalMapping.length
					? [
							knex
								.withSchema(organism)
								.table("subtype_reference_sequence")
								.insert(
									finishedLocalMapping.map((work: Work) => ({
										is_refseq: false,
										idsequence: (work.payload as IPayloadLocalAlignment).idSequence,
										idsequencesubtype: (work.payload as IPayloadLocalAlignment).idSequenceSubtype,
										idsubtype: (work.payload as IPayloadLocalAlignment).idSubtype,
										subtype_score: (work.payload as IPayloadLocalAlignment).alignment_score,
									}))
								),
					  ]
					: []),
			]);
		}
		if (this.size === 0) await mappingUpdate();
	}
}

class Singleton {
	private static instance: TaskManager;
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() {}

	public static getInstance(): TaskManager {
		if (!this.instance) this.instance = new TaskManager();
		return this.instance;
	}
}

export const taskManager = Singleton.getInstance();
export default Singleton.getInstance();
