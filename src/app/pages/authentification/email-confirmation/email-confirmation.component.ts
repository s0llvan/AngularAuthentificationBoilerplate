import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
	selector: 'app-email-confirmation',
	templateUrl: './email-confirmation.component.html',
	styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {
	
	public user: User;
	public error: string = null;
	
	constructor(private api: ApiService, private activatedRoute: ActivatedRoute) { }
	
	ngOnInit(): void {
		this.api.emailConfirmation(this.activatedRoute.snapshot.params.token).subscribe((user) => {
			this.user = user;
		}, (error) => {
			this.error = error;
		});
	}
}
