'use strict';

module.exports = function(app) {
	const authentificationController = require('../controllers/authentificationController');
	
	app
	.route('/login')
	.post(authentificationController.logIn);

	app
	.route('/register')
	.post(authentificationController.register);

	app
	.route('/email-confirm/:token')
	.get(authentificationController.emailConfirmation);

	app
	.route('*')
	.all(authentificationController.verify);

	app
	.route('/logout')
	.get(authentificationController.logOut);
};
