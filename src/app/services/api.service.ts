import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map } from "rxjs/operators";
import { User } from '../models/user';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	
	private apiUrl: string = 'http://localhost:3000/api/';

	constructor(private http: HttpClient) { }
	
	// Http Options
	httpOptions = {
		headers: new HttpHeaders()
		.set('Content-Type', 'application/json')
		.set('Authorization', ''),
		withCredentials: true
	}  
	
	public register(email: string, password: string, captcha: string): Observable<any> {
		let responseData = this.http.post(this.apiUrl + 'register', { email: email, password: password, captcha: captcha }, this.httpOptions).pipe(map((user: any) => new User(user)));
		return from(responseData);
	}

	public login(email: string, password: string, captcha: string): Observable<any> {
		let responseData = this.http.post(this.apiUrl + 'login', { email: email, password: password, captcha: captcha }, this.httpOptions).pipe(map((user: any) => new User(user)));
		return from(responseData);
	}

	public emailConfirmation(token: string): Observable<any> {
		let responseData = this.http.get(this.apiUrl + 'email-confirm/' + token, this.httpOptions).pipe(map((user: any) => new User(user)));
		return from(responseData);
	}

	public getCaptcha(): Observable<any> {
		let responseData = this.http.get(this.apiUrl + 'captcha', { responseType: 'text', withCredentials: true });
		return from(responseData);
	}
}
