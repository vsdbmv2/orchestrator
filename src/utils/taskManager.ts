import {
	IPayloadEpitopeMap,
	IPayloadGlobalAlignment,
	IPayloadLocalAlignment,
	IWork,
	workStatus,
	workType,
} from "@vsdbmv2/mapping-library/types/@types";
import { createHash } from "crypto";

export class Work implements IWork {
	public status: workStatus;
	public type;
	public id1: number;
	public id2?: number;
	public sequence1: string;
	public sequence2?: string;
	public epitopes: string[];
	public workerId: string | undefined;
	public identifier: string;
	public payload?: IPayloadGlobalAlignment | IPayloadLocalAlignment | IPayloadEpitopeMap;
	next: IWork | undefined;
	startTime: number;
	endTime: number;

	constructor(type: workType, sequence1: string, id1: number, sequence2: string | string[], id2?: number) {
		this.type = type;
		this.status = "TODO";
		this.epitopes = [];
		this.sequence1 = sequence1;
		this.id1 = id1;
		if (id2) this.id2 = id2;
		if (type === "global-mapping" || type === "local-mapping") this.sequence2 = sequence2 as string;
		if (type === "epitope-mapping") this.epitopes = sequence2 as string[];
		this.identifier = createHash("md5").update(new Date().toISOString()).digest("hex");
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

	constructor() {
		this.queue = [];
		this.doing = [];
	}

	get size(): number {
		return this.queue.length;
	}
	get sizeDoing(): number {
		return this.doing.length;
	}

	registerWork(type: workType, sequence1: string, id1: number, sequence2: string | string[], id2?: number) {
		const work = new Work(type, sequence1, id1, sequence2, id2);
		this.queue.push(work);
	}

	getWork(worker_id: string, worksAmount: number): Work[] {
		const works: Work[] = this.queue.splice(0, worksAmount);
		if (works.length > 0) {
			works.forEach((work: Work) => {
				work.workerId = worker_id;
				work.status = "ALLOCATED";
			});
			this.doing.push(...works);
		}
		return works;
	}

	deallocateWork(worker_id: string) {
		const works: Work[] = this.doing.filter((work: Work) => work.workerId === worker_id);
		this.doing = this.doing.filter((work: Work) => work.workerId !== worker_id);
		if (works.length > 0) {
			this.queue.push(...works);
		}
	}

	finishWork(finishedWork: Work[]) {
		const ids = finishedWork.map((work: Work) => work.identifier);
		//aqui finaliza uma task removendo ela do doing e salvando o resultado (pode alocar algo pra análise ou sei la)
		//const work: Work | undefined = this.doing.find((work: Work) => work.identifier === identifier && work.workerId === identifier);
		this.doing = this.doing.filter((work: Work) => !ids.includes(work.identifier));
		finishedWork.forEach((work) => {
			console.log(`Saving a ${work.type}`);
			if (!work.payload) return;

			switch (work.type) {
				case "global-mapping": {
					const payload = work.payload as IPayloadGlobalAlignment;
					console.log(
						`global alignment score: Map init (${payload.map_init}), Map end: (${payload.map_end}), Coverage: (${payload.coverage_pct}%)`
					);
					// salva o mapeamento global (salva direto)
					break;
				}
				case "local-mapping": {
					const payload = work.payload as IPayloadLocalAlignment;
					console.log("local alignment score: ", payload.alignment_score);
					// salva a subtipagem (salva no cache para saber o subtipo com maior grau de similaridade)
					break;
				}
				case "epitope-mapping": {
					const payload = work.payload as IPayloadEpitopeMap;
					console.table(payload.epitope_maps);
					// salva o mapeamento do epitopo (salva no cache para gerar relatório de quantos matchs deu)
					break;
				}
				default: {
					console.error("Something went wrong with the work, the payload type was incorrect or inexistent");
					console.table(work);
					break;
				}
			}
		});
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
