import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	
	public formLogin: FormGroup;
	public submitted: boolean = false;
	
	@ViewChild('captcha') captcha: ElementRef;
	
	public email: string = null;
	
	public formLoginValidationMessages = {
		'email': [
			{ type: 'required', message: 'Email is required' },
			{ type: 'email', message: 'Enter a valid email' }
		],
		'password': [
			{ type: 'required', message: 'Password is required' },
			{ type: 'minlength', message: 'Password must be at least 8 characters long' },
			{ type: 'maxlength', message: 'Password must be at least 32 characters long' },
			{ type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
		],
		'captcha': [
			{ type: 'required', message: 'Captcha is required' },
			{ type: 'minlength', message: 'Captcha must be at least 6 characters long' },
			{ type: 'maxlength', message: 'Captcha must be at least 6 characters long' },
			{ type: 'wrong', message: 'Wrong captcha' },
			{ type: 'expired', message: 'Captcha expired' }
		],
		'error': [
			{ type: 'emailNotConfirmed', message: 'Please click on the link sent to your email address to confirm your registration' },
			{ type: 'system', message: 'An error was occured' }
		]
	}
	
	constructor(private api: ApiService, private global: GlobalService, private formBuilder: FormBuilder, private router: Router) {
		this.createForm();
	}
	
	createForm(): void {
		this.formLogin = this.formBuilder.group({
			email: ['test@domain.com', [Validators.required, Validators.email] ],
			password: ['MyPassword1', [Validators.required, Validators.minLength(8), Validators.maxLength(32), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')] ],
			captcha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)] ],
			error: ['']
		});
	}
	
	ngOnInit(): void {
		this.refreshCaptcha();
	}
	
	private onSubmit(): void {
		this.submitted = true;
		
		this.api.login(this.formLogin.get('email').value, this.formLogin.get('password').value, this.formLogin.get('captcha').value).subscribe((response: any) => {
			this.global.setToken(response.token);
			this.submitted = false;
			
			this.router.navigateByUrl('/');
		}, (error) => {
			switch (error.status) {
				case 406:
				error.error.forEach((field) => {
					let key = field.key;
					let value = field.value;
					this.formLogin.controls[key].setErrors({
						[value]: true
					}, { emitEvent: true });
				});
				break;

				case 404:
				this.formLogin.controls['error'].setErrors({
					'emailNotConfirmed': true
				}, { emitEvent: true });
				break;
				
				default:
				this.formLogin.controls['error'].setErrors({
					'system': true
				}, { emitEvent: true });
				break;
			}
			this.submitted = false;
			this.refreshCaptcha();
		});
	}
	
	private refreshCaptcha(): void {
		//this.formRegister.controls['captcha'].patchValue(null, { emitEvent: false });
		
		this.api.getCaptcha().subscribe((response) => {
			this.captcha.nativeElement.innerHTML = response;
		});
	}
}
