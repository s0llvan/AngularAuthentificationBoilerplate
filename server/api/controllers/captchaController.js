'use strict';

const svgCaptcha = require('svg-captcha');
const moment = require('moment');
moment.locale('fr');

exports.get = function(request, response, next) {
	var captcha = svgCaptcha.create({
		size: 6,
		noise: 5
	});
	request.session.captcha = {
		'text': captcha.text,
		'expiration': moment().add(10, 'minutes')
	};
	response.status(200).send(captcha.data);
};