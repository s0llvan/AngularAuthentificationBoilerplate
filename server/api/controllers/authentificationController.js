'use strict';

const moment = require('moment');
moment.locale('fr');

const captchaController = require('./captchaController');
const uuid = require('../../uuid');
const User = require('../models/user');
const { body, validationResult, param, check } = require('express-validator/check');
const { checkEmailExists, checkEmailNotExists } = require('../../utils/validator');

function checkCaptcha(value, { req, loc, path }) {
	let captcha = req.session.captcha;
	req.session.captcha = null;
	
	let expiration = moment().diff(captcha.expiration, 'seconds');
	
	return value == captcha.text && expiration < 0;
}

exports.logIn = async (request, response, next) => {
	try {
		const errors = validationResult(request);
		
		if (!errors.isEmpty()) {
			response.status(422).json({ errors: errors.array() });
			return;
		}
		
		User.findOne({ "email.value": request.body.email, password: request.body.password }).then((user) => {
			if(user) {
				user.generateApiToken();
				response.json({ token: user.api.token });
			} else {
				response.status(422).json({ errors: [{ location: 'body', param: 'password', value: null, msg: 'wrong' }]});
			}
		}, (reason) => {
			response.status(422).json({ errors: [{ location: 'database', param: null, value: reason, msg: '' }]});
		}).catch((error) => {
			response.status(422).json({ errors: [{ location: 'database', param: null, value: error, msg: '' }]});
		});
	} catch(error) {
		return next(error);
	}
}

exports.validate = (method) => {
	switch (method) {
		case 'logIn': {
			return [ 
				body('email').exists().normalizeEmail().isEmail().withMessage('email'),
				body('email').custom(checkEmailExists),
				body('password').exists().isLength({ min: 8, max: 32 }).matches('[0-9]').matches('[a-z]').matches('[A-Z]'),
				body('captcha').exists().custom(checkCaptcha).withMessage('wrong')
			]   
		}
		case 'register': {
			return [ 
				body('email').exists().normalizeEmail().isEmail().withMessage('email'),
				body('email').custom(checkEmailNotExists),
				body('password').exists().isLength({ min: 8, max: 32 }),
				body('captcha').exists().custom(checkCaptcha).withMessage('wrong'),
				body('acceptTerms').isBoolean().withMessage('wrong')
			]   
		}
	}
}

exports.register = function(request, response, next) {	
	try {
		const errors = validationResult(request);
		
		if (!errors.isEmpty()) {
			response.status(422).json({ errors: errors.array() });
			return;
		}
		
		let email = request.body.email;
		let password = request.body.password;
		
		email = { value: email, token: uuid.create() };
		
		User.create({ email: email, password: password }).then((user) => {
			if(user) {
				response.status(422).json({ errors: [{ location: 'body', param: 'password', value: null, msg: 'wrong' }]});
			} else {
				response.status(500);
			}
		}, (reason) => {
			response.status(422).json({ errors: [{ location: 'database', param: null, value: reason, msg: '' }]});
		}).catch((error) => {
			response.status(422).json({ errors: [{ location: 'database', param: null, value: error, msg: '' }]});
		});
	} catch(error) {
		return next(error);
	}
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
				user.email.confirmed = true;
				user.email.token = null;
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
	response.end();
};