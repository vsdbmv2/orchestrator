export interface IUser {
	id: number;
	name: string;
	email: string;
	password?: string;
	context: string;
	created_at?: string;
}
