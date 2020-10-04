'use strict';

module.exports = function(router) {
	const captchaController = require('../controllers/captchaController');
	
	router
	.get('/captcha', captchaController.get);
};
