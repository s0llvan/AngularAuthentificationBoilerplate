import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class GlobalService {
	
	constructor() {

	}

	public setToken(token: string): void {
		localStorage.setItem('token', token);
	}

	public getToken(): string {
		return localStorage.getItem('token');
	}

	public destroyToken(): void {
		localStorage.clear();
	}

	public isLogged(): boolean {
		return this.getToken() != null;
	}
}
