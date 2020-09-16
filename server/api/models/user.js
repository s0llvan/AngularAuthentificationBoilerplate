const mongoose = require('mongoose');
mongoose.plugin(require('@lykmapipo/mongoose-faker'));
const Schema = mongoose.Schema;

function createUUID() {
	var dt = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (dt + Math.random()*16)%16 | 0;
		dt = Math.floor(dt/16);
		return (c=='x' ? r :(r&0x3|0x8)).toString(16);
	});
	return uuid;
}

const UserSchema = new Schema({
	email: {
		value: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
			trim: true,
			minLength: 8,
			maxLength: 64,
			fake: {
				generator: 'internet',
				type: 'email'
			}
		},
		confirmed: {
			type: Boolean,
			required: true,
			default: false,
			fake: {
				generator: 'random',
				type: 'boolean'
			}
		},
		token: {
			type: String,
			required: false,
			default: createUUID(),
			fake: {
				generator: 'random',
				type: 'uuid'
			}
		},
	},
	password: {
		type: String,
		required: true,
		fake: {
			generator: 'internet',
			type: 'password'
		}
	},
	blocked: {
		type: Boolean,
		required: true,
		default: false,
		fake: {
			generator: 'random',
			type: 'boolean'
		}
	},
	api: {
		token: {
			type: String,
			required: false,
			default: null,
			fake: {
				generator: 'random',
				type: 'uuid'
			}
		},
		expiration: {
			type: Date,
			required: false,
			default: null,
			fake: {
				generator: 'date',
				type: 'soon'
			}
		}
	},
	lastLogin: {
		type: String,
		required: true,
		default: new Date(),
		fake: {
			generator: 'date',
			type: 'recent'
		}
	}
}, { timestamps: true });

UserSchema.methods.generateApiToken = function() {
	let expirationDate = new Date();
	expirationDate.setTime(expirationDate.getTime() + (2*60*60*1000));
	
	this.api.token = createUUID();
	this.api.expiration = expirationDate;
	this.save();
}

UserSchema.methods.resetApiToken = function() {
	this.api.token = null;
	this.api.expiration = null;
	this.save();
}

module.exports = mongoose.model('User', UserSchema, 'users');
