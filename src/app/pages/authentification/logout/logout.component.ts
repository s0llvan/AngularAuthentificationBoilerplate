import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
	
	constructor(private global: GlobalService, private router: Router) { }
	
	ngOnInit(): void {
		this.global.destroyToken();
		this.router.navigateByUrl('/');
	}
}
