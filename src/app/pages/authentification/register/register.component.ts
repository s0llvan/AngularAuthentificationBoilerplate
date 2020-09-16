import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { ApiService } from 'src/app/services/api.service';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	
	public formRegister: FormGroup;
	public submitted: boolean = false;
	
	@ViewChild('captcha') captcha: ElementRef;
	
	public error: string = null;
	public email: string = null;
	
	public formRegisterValidationMessages = {
		'email': [
			{ type: 'required', message: 'Email is required' },
			{ type: 'email', message: 'Enter a valid email' },
			{ type: 'exist', message: 'Email already exist' }
		],
		'password': [
			{ type: 'required', message: 'Password is required' },
			{ type: 'minlength', message: 'Password must be at least 8 characters long' },
			{ type: 'maxlength', message: 'Password must be at least 32 characters long' },
			{ type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
		],
		'captcha': [
			{ type: 'required', message: 'Captcha is required' },
			{ type: 'minlength', message: 'Captcha must be at least 8 characters long' },
			{ type: 'maxlength', message: 'Captcha must be at least 8 characters long' },
			{ type: 'wrong', message: 'Wrong captcha' },
			{ type: 'expired', message: 'Captcha expired' }
		],
		'passwordConfirmation': [
			{ type: 'required', message: 'Confirm password is required' },
			{ type: 'mustMatch', message: 'Password mismatch' },
		],
		'acceptTerms': [
			{ type: 'required', message: 'You must accept terms and conditions' }
		]
	}
	
	constructor(private formBuilder: FormBuilder, private api: ApiService) {
		this.createForm();
	}
	
	ngOnInit(): void {
		this.refreshCaptcha();
	}
	
	createForm(): void {
		this.formRegister = this.formBuilder.group({
			email: ['test@domain.com', [Validators.required, Validators.email] ],
			password: ['MyPassword1', [Validators.required, Validators.minLength(8), Validators.maxLength(32), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')] ],
			passwordConfirmation: ['MyPassword1', Validators.required ],
			captcha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)] ],
			acceptTerms: [true, Validators.requiredTrue]
		}, {
			validator: MustMatch('password', 'passwordConfirmation')
		});
	}
	
	onSubmit(): void {
		this.submitted = true;
		this.error = null;
		
		this.api.register(this.formRegister.get('email').value, this.formRegister.get('password').value, this.formRegister.get('captcha').value).subscribe((data: any) => {
			this.email = data.email;
			this.submitted = false;
		}, (error) => {
			switch (error.status) {
				case 406:
				error.error.forEach((field) => {
					let key = field.key;
					let value = field.value;
					this.formRegister.controls[key].setErrors({
						[value]: true
					}, { emitEvent: true });
				});
				this.refreshCaptcha();
				break;
				
				default:
				this.error = 'An error was occured';
				break;
			}
			this.submitted = false;
		});
	}
	
	private refreshCaptcha(): void {
		//this.formRegister.controls['captcha'].patchValue(null, { emitEvent: false });
		
		this.api.getCaptcha().subscribe((response) => {
			this.captcha.nativeElement.innerHTML = response;
		});
	}
}
