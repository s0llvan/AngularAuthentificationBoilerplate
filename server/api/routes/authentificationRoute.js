'use strict';

module.exports = function(router) {
	const authentificationController = require('../controllers/authentificationController');
	
	/*
	app
	.route('/login')
	.post(authentificationController.logIn);
	*/
	router
	.post('/login', authentificationController.validate('logIn'), authentificationController.logIn)

	/*
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
	*/
};
