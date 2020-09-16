const mongoose = require('mongoose');
const User = require('./api/models/user');

mongoose
.connect('mongodb://127.0.0.1:27017/database', {
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(() => {
	
	mongoose.connection.db.dropDatabase();
	
	const users = User.fake(20);
	User.create(users);
})
.catch(err => {
	console.log('Unable to connect', err);
});
