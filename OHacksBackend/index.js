// -------------------------------------------------------------------------------//
// ---------------------- SERVER SETUP AND MAIN DEPENDENCIES ------------------------//
// -------------------------------------------------------------------------------//

// VARIABLES FOR DEPENDENCIES
var passport = require('passport'); // for authentication
var express = require('express'); // for server
var mongoose = require('mongoose'); // for mongodb connection
var bodyParser = require('body-parser'); // to read body for POST requests
var cheerio = require('cheerio'); // for easy http requests
var morgan = require('morgan'); // for server messages

// EXPRESS server setup
var app = express();
var session = require('express-session');
app.use(morgan('dev'));
app.use(bodyParser.json());

// STATIC FILES HANDLING
app.use(express.static(__dirname + '/views'));

// SOCKET.io setup
var http = require('http').Server(app);
var io = socket.listen(http);

// PASSPORT INITIALIZATION
var auth = require('./app/passport/auth.js');
require('./app/passport/passport.js')(passport, auth);
app.use(session({secret: 'App_Secret'})); 
app.use(passport.initialize());
app.use(passport.session());

// MONGODB INITIALIZATION
var config = require('./app/database/database.js');
mongoose.connect(config.url);

// EXPRESS ROUTE INITIALIZATION
require('./app/main/routes.js')(app, passport); // configures routes in routes.js

// server start
var port = (process.env.PORT || 8080); // set to process.env.PORT to allow Heroku to set
http.listen(port, function() {
	console.log("LISTENING ON " + port);
});