const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose
.connect('mongodb://127.0.0.1:27017/database', {
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(() => {
	app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
	app.use(bodyParser.json({ limit: '1mb' }));
	app.use(cors({ credentials: true, origin: true }));
	app.use(session({
		secret: 'eeQuai7UuYiB',
		resave: false,
		saveUninitialized: true,
		expires: new Date(Date.now() + 3600000),
		cookie: { secure: false, maxAge: 3600000 },
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	}));
	
	var captchaRoute = require('./api/routes/captchaRoute');
	captchaRoute(app);
	
	var authentificationRoute = require('./api/routes/authentificationRoute');
	authentificationRoute(app);

	app.get('/', (request, response) => {
		response.status(200).end();
	});
	
	app.listen(port, () => {
		console.log('Node.js + MongoDB RESTful API server started on: ' + port);
	});
})
.catch(err => {
	console.log('Unable to connect', err);
});
