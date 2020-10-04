const User = require('../api/models/user')

module.exports.checkEmailExists = (value) => {
	return new Promise((resolve, reject) => {
		User.findOne({ "email.value": value }, (error, user) => {
			if (user) {
				if(!user.email.confirmed) {
					reject('not_confirmed');
				}
				else if(user.email.blocked) {
					reject('blocked');
				}
			} else {
				reject('not_exist');
			}
			resolve();
		});
	})
}

module.exports.checkEmailNotExists = (value) => {
	return new Promise((resolve, reject) => {
		User.findOne({ "email.value": value }, (error, user) => {
			if (user) {
				reject('exist');
			}
			resolve();
		});
	})
}