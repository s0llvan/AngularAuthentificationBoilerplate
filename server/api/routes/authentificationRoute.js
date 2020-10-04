'use strict';

module.exports = function(router) {
	const authentificationController = require('../controllers/authentificationController');
	
	router
	.post('/login', authentificationController.validate('logIn'), authentificationController.logIn)

	router
	.post('/register', authentificationController.validate('register'), authentificationController.register)

	/*
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
