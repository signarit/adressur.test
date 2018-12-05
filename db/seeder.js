var promise = require('promise');
var mysql = require('mysql');
var fs = require('fs');
var readline = require('readline');
var config = require('../config');

// Set up MySQL
var mysql = mysql.createConnection({
	host: config.db.host,
	port: config.db.port,
	user: config.db.username,
	password: config.db.password,
	database: config.db.database,
	charset: config.db.charset
});

mysql.connect();

// Set up basic paths to files
var base_path = 'public/upload/';
var path_to_zip_codes = base_path + 'postnr.txt';
var path_to_addresses = base_path + 'adr.txt';
var path_to_municipalities = base_path + 'kommunur.txt';
var path_to_roads = base_path + 'veg.txt';

// Create a file reader from a path
function read_file(path_to_file) {
	return line_reader = readline.createInterface({
		input: fs.createReadStream(path_to_file, 'latin1'),
	});
}

var seed_users = new Promise(function(resolve, reject) {
	var users = config.users;

	users.forEach(function(user, index) {
		var data = {
			name: user.name,
			email: user.email,
			password: user.password
		}

		mysql.query('INSERT INTO users SET ?', data, function(error, rows, fields) {
			if (error) console.log(error.message);
		});
	});
});

var seed_zip_codes = new Promise(function(resolve, reject) {
	var line_reader = read_file(path_to_zip_codes);

	var line_number = 0;

	line_reader.on('line', function(line) {
		// Line parts are:
		// Postnr;Stað;Kommuna;Fs1;Fs2;Stað hvmf
		// 0: Postnr
		// 1: Stað
		// 2: Kommuna
		// 3: Fs1
		// 4: Fs2
		// 5: Stað hvmf
		var line_parts = line.split(';');


		// We don't need the first line so we skip it
		// And we don't continue if we have an empty line
		if (line_number > 0 && line_parts.length > 1) {
			var values = {
				zip_code: parseInt(line_parts[0]),
				municipality_id: parseInt(line_parts[2]),
				name: line_parts[1]
			}

			mysql.query('INSERT INTO zip_codes SET ?', values, function(error, rows, fields) {
				if (error) console.log(error.message);
			});
		}

		line_number++;
	});

	line_reader.on('close', function() {
		resolve('Finished seeding zip codes!');
	});
});

var seed_municipalities = new Promise(function(resolve, reject) {
	var line_reader = read_file(path_to_municipalities);

	var line_number = 0;

	line_reader.on('line', function(line) {
		// Line parts are:
		// Kommununr;Kommuna
		// 0: Kommununr
		// 1: Kommuna
		var line_parts = line.split(';');


		// We don't need the first line so we skip it
		// And we don't continue if we have an empty line
		if (line_number > 0 && line_parts.length > 1) {
			var values = {
				municipality_id: parseInt(line_parts[0]),
				name: line_parts[1]
			}

			mysql.query('INSERT INTO municipalities SET ?', values, function(error, rows, fields) {
				if (error) console.log(error.message);
			});
		}

		line_number++;
	});

	line_reader.on('close', function() {
		resolve('Finished seeding municipalities!');
	});
});

var seed_roads = new Promise(function(resolve, reject) {
	var line_reader = read_file(path_to_roads);

	var line_number = 0;

	line_reader.on('line', function(line) {
		// Line parts are:
		// Veganr;X;Y;Vegur;Vegur_s;Postnr;Kommununr;Rætningur;Galdandi_frá
		// 0: Veganr
		// 1: X
		// 2: Y
		// 3: Vegur
		// 4: Vegur_s
		// 5: Postnr
		// 6: Kommununr
		// 7: Rætningur
		// 8: Galdandi_Frá
		var line_parts = line.split(';');


		// We don't need the first line so we skip it
		// And we don't continue if we have an empty line
		if (line_number > 0 && line_parts.length > 1) {
			var values = {
				road_id: parseInt(line_parts[0]),
				municipality_id: parseInt(line_parts[6]),
				zip_code_id: parseInt(line_parts[5]),
				name: line_parts[3],
				x: parseFloat(line_parts[1]),
				y: parseFloat(line_parts[2])
			}

			mysql.query('INSERT INTO roads SET ?', values, function(error, rows, fields) {
				if (error) console.log(error.message);
			});
		}

		line_number++;
	});

	line_reader.on('close', function() {
		resolve('Finished seeding roads!');
	});
});

var seed_addresses = new Promise(function(resolve, reject) {
	var line_reader = read_file(path_to_addresses);

	var line_number = 0;

	line_reader.on('line', function(line) {
		// Line parts are:
		// Adressutal;X;Y;Húsanr;Húsatal;Húsastavur;Húsanavn;Veganr;Postnr;Kommununr;Eindir;Býlingsnr;Rætningur;LfyBygd;Galdandi_frá
		// 0: Adressutal
		// 1: X
		// 2: Y
		// 3: Húsanr
		// 4: Húsatal
		// 5: Húsastavur
		// 6: Húsanavn
		// 7: Veganr
		// 8: Postnr
		// 9: Kommununr
		// 10: Eindir
		// 11: Býlingsnr
		// 12: Rætningur
		// 13: LfyBygd
		// 14: Galdandi_frá
		var line_parts = line.split(';');


		// We don't need the first line so we skip it
		// And we don't continue if we have an empty line
		// For some reason, we need to start from the second line when reading the addresses
		if (line_number > 1 && line_parts.length > 1) {
			var values = {
				address_id: parseInt(line_parts[0]),
				road_id: parseInt(line_parts[7]),
				zip_code_id: parseInt(line_parts[8]),
				municipality_id: parseInt(line_parts[9]),
				x: parseFloat(line_parts[1]),
				y: parseFloat(line_parts[2]),
				house_number: line_parts[4],
				house_letter: line_parts[5],
				house_name: line_parts[6]
			}

			mysql.query('INSERT INTO addresses SET ?', values, function(error, rows, fields) {
				if (error) console.log(error.message);
			});
		}

		line_number++;
	});

	line_reader.on('close', function() {
		resolve('Finished seeding addresses!');
	});
});

Promise.all([
	seed_users,
	seed_zip_codes,
	seed_municipalities,
	seed_addresses,
	seed_roads
]).then(function(response) {
	console.log(response);

	// Disconnect from MySQL
	mysql.end();
});