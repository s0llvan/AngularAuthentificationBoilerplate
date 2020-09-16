'use strict';

const moment = require('moment');
moment.locale('fr');

const captchaController = require('./captchaController');
const responseController = require('./responseController');
const uuid = require('../../uuid');

const User = require('../models/user');

exports.logIn = function(request, response, next) {
	let email = request.body.email;
	let password = request.body.password;
	
	if(!captchaController.verifyCaptcha(request, response)) {
		return;
	}
	
	User.findOne({ email: email, password: password }).then((user) => {
		if(user) {
			if(user.emailConfirmed) {
				user.generateApiToken();
				responseController.data(response, { token: user.api.token });
			} else {
				responseController.formError(response, 'error', 'emailNotConfirmed');
			}
		} else {
			response.status(404).end();
		}
	}, (reason) => {
		responseController.systemError(response, reason);
	}).catch((error) => {
		responseController.systemError(response, error.message);
	});
};

exports.register = function(request, response, next) {
	let email = request.body.email;
	let password = request.body.password;
	
	if(!captchaController.verifyCaptcha(request, response)) {
		return;
	}
	
	User.findOne({ 'email.value': email }, (error, user) => {
		if (error) {
			responseController.systemError(response, error.message);
			return;
		}
		if(user) {
			responseController.formError(response, 'email', 'exist');
			return;
		}

		let userEmail = { value: email, token: uuid.create() };
		
		User.create({ email: userEmail, password: password }).then((user) => {
			responseController.data(response, { email: user.email.value });
		}, (reason) => {
			responseController.systemError(response, reason);
		}).catch((error) => {
			responseController.systemError(response, error.message);
		});
	}).catch((error) => {
		responseController.systemError(response);
	});
};

exports.verify = function(request, response, next) {
	let token = request.get('Authorization');
	if(token) {
		User.findOne({ 'api.token': token }).then((user) => {
			if(!user) {
				response.status(404).end();
			} else {
				request.user = user;
				next();
			}
		}, (reason) => {
			response.status(406).end(reason);
		}).catch((error) => {
			response.status(403).end(error.message);
		})
	} else {
		response.status(403).end();
	}
};

exports.emailConfirmation = function(request, response, next) {
	if(request.params.token) {
		User.findOne({ 'email.token': request.params.token }).then((user) => {
			if(!user) {
				response.status(404).end();
			} else {
				user.emailConfirmed = true;
				user.emailConfirmationToken = null;
				user.save();

				response.json(user);
			}
		}, (reason) => {
			response.status(406).end(reason);
		}).catch((error) => {
			response.status(403).end(error.message);
		})
	} else {
		response.status(404).end();
	}
};

exports.logOut = function(request, response, next) {
	let user = request.user;
	user.resetApiToken();
	response.status(200).end();
};