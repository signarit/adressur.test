var config = require('./config');
var multer = require('multer');
var fs = require('fs');
var readline = require('readline');
var bcrypt = require('bcrypt');


/********************************
 *
 * Multer
 *
 ********************************/

// Setting the destination for the uploaded file and the generated filename
var storage_settings = multer.diskStorage({
	// Files are saved to ./public/upload
	destination: function(req, file, cb) {
		cb(null, config.upload.path);
	},

	filename: function(req, file, cb) {
		var date = new Date();
		var day = (date.getUTCDate() > 9) ? date.getUTCDate() : "0" + date.getUTCDate();
		var month = ((date.getUTCMonth() + 1) > 9) ? date.getUTCMonth() + 1 : "0" + (date.getUTCMonth() + 1);
		var year = date.getUTCFullYear();

		// Files are named YYYY_MM_DD_[fieldname].txt so they can be easily sorted		
		cb(null, year + '_' + month + '_' + day + '_' + file.fieldname + '.txt');
	}
});

function file_filter(req, file, cb) {
	// If the file isn't a txt-file, we reject it..
	if (file.mimetype != "text/plain") {
		cb(null, false);
	}

	// ..otherwise we accept the file
	cb(null, true);
}

// Set up multer with file filter and storage settings
var upload = multer({ 
	fileFilter: file_filter,
	storage: storage_settings 
});

// Only these field names are accepted
var accept_files = upload.fields([
	{ name: 'addresses' },
	{ name: 'municipalities' },
	{ name: 'roads' },
	{ name: 'units' },
	{ name: 'zip_codes' }
]);

module.exports = function(app, mysql) {
	/***************************
	 *
	 * General routes
	 *
	 ***************************/
	app.get('/', function(req, res) {
		res.send('Hello World!');
	});

	app.get('/login', function(req, res) {
		if (req.session.logged_in) {
			res.redirect('/admin');
		}

		res.sendFile2('login.html');
	});

	app.post('/login', function(req, res) {
		var email = req.body.email;
		var password = req.body.password;

		mysql.query("SELECT * FROM users WHERE email = '"+ email +"'", function(err, results, fields) {
			if (err) res.json(err);

			if (results.length > 0) {
				bcrypt.compare(password, results[0].password, function(err, result) {
					if (err) { res.redirect('/logout'); }
					
					if (! result) {
						res.redirect('/login');
					} else {
						req.session.logged_in = true;
						req.session.name = results[0].name;
						req.session.email = results[0].email;
						
						res.redirect('/admin');
					}
				});
			} else {
				res.sendFile2('login.html');
			}
		});
	});

	app.get('/logout', function(req, res) {
		req.session.destroy(function(err) {
			if (err) { console.log(err); }

			res.redirect('/login');
		});
	});

	app.get('/admin', function(req, res) {
		if (req.session.logged_in) {
			res.sendFile2('admin.html');
		} else {
			res.redirect('/login');
		}
	});

	app.post('/upload', accept_files, function(req, res) {
		if (! req.session.logged_in) {
			res.redirect('/login');
		}

		// Container to potentially send back to the client to inform
		// of which files were successfully uploaded
		var files_uploaded = [];

		// Fieldname corresponds to the name attribute of the html page.
		// Example: <input type="file" name="addresses">. Here addresses is the fieldname
		for(var fieldname in req.files) {
			var filename = req.files[fieldname][0].filename;
			var path = req.files[fieldname][0].path;

			if (fieldname == 'zip_codes') {
				var line_reader = readline.createInterface({
					input: fs.createReadStream(path, 'latin1'),
				});

				var i = 0;

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
					if (i > 0 && line_parts.length > 1) {
						var values = {
							zip_code: parseInt(line_parts[0]),
							municipality_id: parseInt(line_parts[2]),
							name: line_parts[1]
						}

						var query = mysql.query('INSERT INTO zip_codes SET ?', values, function(err, rows, fields) {
							if (err) throw err;
						});
					}

					i++;
				});
			}

			if (fieldname == 'municipalities') {
				var line_reader = readline.createInterface({
					input: fs.createReadStream(path, {
						encoding: 'latin1'
					}),
				});

				var i = 0;

				line_reader.on('line', function(line) {
					// Line parts are:
					// Kommununr;Kommuna
					// 0: Kommununr
					// 1: Kommuna
					var line_parts = line.split(';');


					// We don't need the first line so we skip it
					// And we don't continue if we have an empty line
					if (i > 0 && line_parts.length > 1) {
						var values = {
							municipality_id: parseInt(line_parts[0]),
							name: line_parts[1]
						}

						var query = mysql.query('INSERT INTO municipalities SET ?', values, function(err, rows, fields) {
							if (err) throw err;
						});
					}

					i++;
				});
			}

			if (fieldname == 'roads') {
				var line_reader = readline.createInterface({
					input: fs.createReadStream(path, 'latin1'),
				});

				var i = 0;

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
					if (i > 0 && line_parts.length > 1) {
						var values = {
							road_id: parseInt(line_parts[0]),
							municipality_id: parseInt(line_parts[6]),
							zip_code_id: parseInt(line_parts[5]),
							name: line_parts[3],
							x: parseFloat(line_parts[1]),
							y: parseFloat(line_parts[2])
						}

						var query = mysql.query('INSERT INTO roads SET ?', values, function(err, rows, fields) {
							if (err) throw err;
						});
					}

					i++;
				});
			}

			if (fieldname == 'addresses') {
				var line_reader = readline.createInterface({
					input: fs.createReadStream(path, 'latin1'),
				});

				var i = 0;

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
					if (i > 1 && line_parts.length > 1) {
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

						var query = mysql.query('INSERT INTO addresses SET ?', values, function(err, rows, fields) {
							if (err) throw err;
						});
					}

					i++;
				});
			}

			files_uploaded.push(req.files[fieldname]);
		}

		// res.json(files_uploaded);
		res.redirect('/admin');
	});


	/***************************
	 *
	 * Municipalities
	 *
	 ***************************/
	app.get('/kommunur', function(req, res) {
		mysql.query('SELECT * FROM municipalities', function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/kommuna/:id', function(req, res) {
		var id = req.params.id;

		mysql.query('SELECT * FROM municipalities WHERE id = '+ id, function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/kommuna/:id/bygdir', function(req, res) {
		var id = req.params.id;

		mysql.query('SELECT * FROM zip_codes WHERE municipality_id = (SELECT municipality_id FROM municipalities WHERE id = '+ id +')', function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/kommuna/:id/vegir', function(req, res) {
		var id = req.params.id;

		mysql.query('SELECT * FROM roads WHERE municipality_id = (SELECT municipality_id FROM municipalities WHERE id = '+ id +')', function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/kommuna/:id/bustadir', function(req, res) {
		var id = req.params.id;

		mysql.query('SELECT * FROM addresses WHERE municipality_id = (SELECT municipality_id FROM municipalities WHERE id = '+ id +')', function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	/*************************
	 *
	 * Postnummur
	 *
	 *************************/

	app.get('/postnummur', function(req, res) {
		mysql.query('SELECT * FROM zip_codes', function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/postnummur/kommunur', function(req, res) {
		mysql.query('SELECT * FROM zip_codes JOIN municipalities ON zip_codes.municipality_id = municipalities.municipality_id', function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/postnummar/:zip_code', function(req, res) {
		var zip_code = req.params.zip_code;

		mysql.query('SELECT * FROM zip_codes WHERE zip_code = '+ zip_code, function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/postnummar/:zip_code/kommuna', function(req, res) {
		var zip_code = req.params.zip_code;

		mysql.query('SELECT * FROM municipalities WHERE municipality_id = (SELECT municipality_id FROM zip_codes WHERE zip_code = '+ zip_code +')', function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/postnummar/:zip_code/vegir', function(req, res) {
		var zip_code = req.params.zip_code;

		mysql.query('SELECT * FROM roads WHERE zip_code_id = '+ zip_code, function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/postnummar/:zip_code/bustadir', function(req, res) {
		var zip_code = req.params.zip_code;

		mysql.query('SELECT * FROM addresses WHERE zip_code_id = '+ zip_code, function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});


	/*************************
	 *
	 * Cities
	 *
	 *************************/
	app.get('/bygdir', function(req, res) {
		mysql.query('SELECT * FROM zip_codes', function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/bygdir/kommuna', function(req, res) {
		mysql.query('SELECT zip_codes.*, municipalities.name AS municipality_name FROM zip_codes JOIN municipalities ON zip_codes.municipality_id = municipalities.municipality_id', function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/bygd/:id', function(req, res) {
		var id = req.params.id;

		mysql.query('SELECT * FROM zip_codes WHERE id = '+ id, function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/bygd/:id/vegir', function(req, res) {
		var id = req.params.id;

		mysql.query('SELECT * FROM roads WHERE zip_code_id = (SELECT zip_code FROM zip_codes WHERE id = '+ id +')', function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/bygd/:id/bustadir', function(req, res) {
		var id = req.params.id;

		mysql.query('SELECT * FROM addresses WHERE zip_code_id = (SELECT zip_code FROM zip_codes WHERE id = '+ id +')', function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});


	/********************************
	 *
	 * Roads
	 *
	 ********************************/
	app.get('/vegir', function(req, res) {
		mysql.query('SELECT * FROM roads', function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/vegur/:id', function(req, res) {
		var id = req.params.id;

		mysql.query('SELECT * FROM roads WHERE id = '+ id, function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});

	app.get('/vegur/:id/bustadir', function(req, res) {
		var id = req.params.id;

		mysql.query('SELECT * FROM addresses WHERE road_id = (SELECT road_id FROM roads WHERE id = '+ id +')', function(err, results, fields) {
			if (err) res.json(err);

			res.json(results);
		});
	});
}