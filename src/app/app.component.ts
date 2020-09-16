import { Component } from '@angular/core';
import { GlobalService } from './services/global.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'Life';
	
	constructor(public global: GlobalService) {

	}
}
