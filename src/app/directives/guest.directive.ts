import { Directive, ElementRef } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';

@Directive({
	selector: '[guest]'
})
export class GuestDirective {
	
	constructor(private elementRef: ElementRef, private global: GlobalService, private router: Router) {
		this.router.events.subscribe(() => {
			this.check();
		});
	}
	
	private check(): void {
		if(this.global.isLogged()) {
			this.elementRef.nativeElement.style.display = 'none';
		} else {
			this.elementRef.nativeElement.style.display = 'block';
		}
	}
}
