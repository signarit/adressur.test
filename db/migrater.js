var mysql = require('mysql');
var config = require('../config');

// Set up MySQL
var mysql = mysql.createConnection({
	host: config.db.host,
	user: config.db.username,
	password: config.db.password,
	// database: config.db.database,
	charset: config.db.charset
});


// Connect to MySQL
mysql.connect();

/********************************
 *
 * Create the database, addresses, and switch to it
 *
 ********************************/
var create_database = new Promise(function(resolve, reject) {
	mysql.query('CREATE DATABASE IF NOT EXISTS ' + config.db.database, function(err, results, fields) {
		if (err) reject(err.message)

		resolve('Database created');
	});
});

var change_database = new Promise(function(resolve, reject) {
	mysql.changeUser({
		database: config.db.database
	}, function(err) {
		if (err) reject(err.message);

		resolve('Database changed');
	});
});

/********************************
 *
 * Migrate table for zip codes
 *
 ********************************/
var migrate_zip_codes = new Promise(function(resolve, reject) {
	mysql.query(
		'CREATE TABLE IF NOT EXISTS zip_codes ( '+
		'	id INT NOT NULL AUTO_INCREMENT, '+
		'	municipality_id INT NOT NULL, '+
		'	zip_code INT NOT NULL, '+
		'	name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL, '+
		'	PRIMARY KEY(id, municipality_id) '+
		');', 
		function(err, results, fields) {
			if (err) reject(err.message);

			resolve('Zip codes migrated');
		}
	);
});

/********************************
 *
 * Migrate table for municipalities
 *
 ********************************/
var migrate_municipalities = new Promise(function(resolve, reject) {
	mysql.query(
		'CREATE TABLE IF NOT EXISTS municipalities ( '+
		'	id INT NOT NULL AUTO_INCREMENT, '+
		'	municipality_id INT NOT NULL, '+
		'	name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL, '+
		'	PRIMARY KEY(id, municipality_id) '+
		'); ', 
		function(err, results, fields) {
			if (err) reject(err.message);

			resolve('Municipalities migrated');
		}
	)
});

/********************************
 *
 * Migrate table for roads
 *
 ********************************/
var migrate_roads = new Promise(function(resolve, reject) {
	mysql.query(
		'CREATE TABLE IF NOT EXISTS roads ( '+
		'	id INT NOT NULL AUTO_INCREMENT, '+
		' 	road_id INT NOT NULL,  '+
		'	municipality_id INT NOT NULL,  '+
		'	zip_code_id INT NOT NULL,  '+
		'	name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,  '+
		'	x DECIMAL(9,2) NOT NULL,  '+
		'	y DECIMAL(9,2) NOT NULL,  '+
		'	PRIMARY KEY (id, road_id, municipality_id, zip_code_id) '+
		'); ', 
		function(err, results, fields) {
			if (err) reject(err.message);

			resolve('Roads migrated');
		}
	)
});

/********************************
 *
 * Migrate table for addresses
 *
 ********************************/
var migrate_addresses = new Promise(function(resolve, reject) {
	mysql.query(
		'CREATE TABLE IF NOT EXISTS addresses ( '+
		'	id INT NOT NULL AUTO_INCREMENT, '+
		'	address_id INT NOT NULL, '+
		'	road_id INT NOT NULL, '+
		'	zip_code_id INT NOT NULL, '+
		'	municipality_id INT NOT NULL, '+
		'	x DECIMAL(9,2) NOT NULL, '+
		'	y DECIMAL(9,2) NOT NULL, '+
		'	house_number INT, '+
		'	house_letter VARCHAR(255), '+
		'	house_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci, '+
		'	PRIMARY KEY(id, address_id, road_id, zip_code_id, municipality_id) '+
		'); ', 
		function(err, results, fields) {
			if (err) reject(err.message);

			resolve('Addresses migrated');
		}
	)
});


// We first create the database
create_database.then(function(response) {
	console.log(response);

	// Then we change to the newly created database
	change_database.then(function(response) {
		console.log(response);

		// Then we fire all of our migrations
		Promise.all([
			migrate_zip_codes,
			migrate_municipalities,
			migrate_addresses,
			migrate_roads
		]).then(function(response) {
			console.log(response);

			// And finally we disconnect from MySQL
			mysql.end();
		}).catch(function(error) {
			console.log(error); // Migration errors
		});
	}).catch(function(error) {
		console.log(error) // Changing database error
	});
}).catch(function(error) {
	console.log(error); // Creating database error
});