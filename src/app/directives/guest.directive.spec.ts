import { GuestDirective } from './guest.directive';

describe('GuestDirective', () => {
	it('should create an instance', () => {
		const directive = new GuestDirective(null, null, null);
		expect(directive).toBeTruthy();
	});
});
