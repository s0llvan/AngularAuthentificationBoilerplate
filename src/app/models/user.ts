import { Character } from './character';
import { UserEmail } from './user-email';

export class User {
	public email: UserEmail;

	public password: string;
	public character: Character;
	public lastLogin: Date;
	
	public createdAt: Date;
	public updatedAt: Date;
	
	constructor(data: any) {
		Object.assign(this, data);
	}
}
