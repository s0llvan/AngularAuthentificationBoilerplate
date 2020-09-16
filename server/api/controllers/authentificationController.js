'use strict';

const moment = require('moment');
moment.locale('fr');

const captchaController = require('./captchaController');
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
				response.status(200).json({ token: user.api.token });
			} else {
				response.status(406).json([{ key: 'error', value: 'emailNotConfirmed' }]);
			}
		} else {
			response.status(404).end();
		}
	}, (reason) => {
		response.status(406).json([{ key: 'error', value: 'system' }]);
	}).catch((error) => {
		response.status(406).json([{ key: 'error', value: 'system' }]);
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
			response.status(406).json([{ key: 'error', value: 'system' }]);
			return;
		}
		if(user) {
			response.status(406).json([{ key: 'email', value: 'exist' }]);
			return;
		}

		let userEmail = { value: email, token: uuid.create() };
		
		User.create({ email: userEmail, password: password }).then((user) => {
			response.status(200).json({ email: user.email.value });
		}, (reason) => {
			response.status(406).json([{ key: 'error', value: 'system' }]);
		}).catch((error) => {
			response.status(406).json([{ key: 'error', value: 'system' }]);
		});
	}).catch((error) => {
		response.status(406).json([{ key: 'error', value: 'system' }]);
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