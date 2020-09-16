'use strict';

module.exports = function(app) {
	const captchaController = require('../controllers/captchaController');
	
	app
	.route('/captcha')
	.get(captchaController.getCaptcha);
};
