var config = require('./config');
var express = require('express');
var session = require('express-session');
var bcrypt = require('bcrypt');
var app = express();
var mysql = require('mysql');
var bodyparser = require('body-parser');
var cookieparser = require('cookie-parser');
var cors = require('cors');

app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(session({
	secret: config.server.session_secret,
	resave: true,
	saveUninitialized: false
}));

/********************************
 *
 * Set up and connect to MySQL
 *
 ********************************/
var mysql = mysql.createConnection({
	host: config.db.host,
	user: config.db.username,
	port: config.db.port,
	password: config.db.password,
	database: config.db.database,
	charset: config.db.charset
});

mysql.connect();

/********************************
 *
 * Sets up and fetch routes
 *
 ********************************/
function set_path_to_public(req, res, next) {
	res.sendFile2 = function(file) {
		return res.sendFile(__dirname + '/public/' + file);
	}

	next();
}

function log_request(req, res, next) {
	if (req.path == '/favicon.ico') { next(); }
	
	var values = {
		path: req.path,
		ip: (req.ip.substr(0, 7) == '::ffff:') ? req.ip.substr(7, req.ip.length) : req.ip, 		// Remove ::ffff: from the IP-string
	}

	mysql.query('INSERT INTO statistics SET ?', values, function(error, rows, fields) {
		if (error) console.log(error.message);
	});

	next();
}

app.use(set_path_to_public);
app.use(express.static(__dirname + '/public'));
app.use(log_request)

require('./routes')(app, mysql);

/********************************
 *
 * Server
 *
 ********************************/

app.listen(config.server.port, function() {
	console.log('Listening on port '+ config.server.port +'...');
});
