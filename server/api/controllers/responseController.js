'use strict';

const moment = require('moment');
moment.locale('fr');

exports.data = function(response, data) {
	response.status(200).json(data);
};

exports.formError = function(response, field, type) {
	response.status(406).json([{ key: field, value: type }]);
};

exports.systemError = function(response, message='An error was occured') {
	response.status(500).json({
		message: message
	});
};