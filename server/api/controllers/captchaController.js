'use strict';

const svgCaptcha = require('svg-captcha');
const moment = require('moment');
moment.locale('fr');

exports.getCaptcha = function(request, response, next) {
	var captcha = svgCaptcha.create({
		size: 8,
		noise: 5
	});
	request.session.captcha = {
		'text': captcha.text,
		'expiration': moment().add(5, 'minutes')
	};
	response.status(200).send(captcha.data);
};

exports.verifyCaptcha = function(request, response) {
	let captcha = request.body.captcha;
	let captchaServer = request.session.captcha;
	
	request.session.captcha = null;

	if(!captchaServer.expiration) {
		response.status(406).json([{ key: 'error', value: 'system' }]);
		return false;
	}
	
	let expiration = moment().diff(captchaServer.expiration, 'seconds');
	if(expiration > 0) {
		response.status(406).json([{ key: 'captcha', value: 'expired' }]);
		return false;
	}
	
	if(captcha != captchaServer.text) {
		response.status(406).json([{ key: 'captcha', value: 'wrong' }]);
		return false;
	}
	return true;
};