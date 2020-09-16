import { UserDirective } from './user.directive';

describe('UserDirective', () => {
	it('should create an instance', () => {
		const directive = new UserDirective(null, null, null);
		expect(directive).toBeTruthy();
	});
});
