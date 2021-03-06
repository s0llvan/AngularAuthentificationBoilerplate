const mongoose = require('mongoose');
mongoose.plugin(require('@lykmapipo/mongoose-faker'));
const Schema = mongoose.Schema;
const uuid = require('../../uuid');

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
			default: uuid.create(),
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
	
	this.api.token = uuid.create();
	this.api.expiration = expirationDate;
	this.save();
}

UserSchema.methods.resetApiToken = function() {
	this.api.token = null;
	this.api.expiration = null;
	this.save();
}

module.exports = mongoose.model('User', UserSchema, 'users');
