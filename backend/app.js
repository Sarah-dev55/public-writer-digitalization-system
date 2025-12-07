var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// new API routes
var appointmentsRouter = require('./routes/appointments');
var availabilityRouter = require('./routes/availability');
var checklistsRouter = require('./routes/checklists');
var documentsRouter = require('./routes/documents');
var apiUsersRouter = require('./routes/apiUsers');

// connect to database
require('./src/config/database').connect();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Simple CORS middleware for local development
app.use(function(req, res, next) {
	// allow requests from the frontend dev server
	res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH');
		return res.sendStatus(200);
	}
	next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/checklists', checklistsRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/users', apiUsersRouter);

module.exports = app;
