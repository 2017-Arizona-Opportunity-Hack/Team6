// -------------------------------------------------------------------------------//
// ---------------------- HANDLES ROUTES FROM THE CLIENT ------------------------//
// -------------------------------------------------------------------------------//

var dog = require('../database/FosteredDog.js');
var foster = require('../database/Foster.js');

module.exports = function(app, passport) {

	/************************ ROUTES FOR RENDERING PAGES ***********************/

	// home page
	app.get('/', function(req, res){
		res.render("login.ejs");
	});

	// ANDROID LOGIN/SIGNUP
	app.post('/android_signup', passport.authenticate('android-signup'), function(req, res){
		res.send(204);
	});
	
	app.post('/android_login', passport.authenticate('android-login'), function(req, res){
		res.send(204);
	});
	
	// HANDLES USER LOGIN

	app.get('/login', function(req, res){
		res.render('login.ejs', {message : req.flash('loginMessage')});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/dogadd',
		failureRedirect : '/login',
		failureFlash : true,
	}));

	// HANDLES USER SIGNUP

	app.get('/signup', function(req, res){
		res.render('signup.ejs', {message : req.flash('signupMessage')});
	});

	app.post('/signup', 	
		passport.authenticate('local-signup', {
			successRedirect : '/dogadd',
			failureRedirect : '/signup',
			failureFlash : true,
		}));

	// signs the user out of session
	app.get('/logout', function(req, res){
		req.logout();
		res.render('login.ejs');
	});

	app.get('/dogadd', isLoggedInAuth, function(req, res){
		res.send("fuck");
	});	


	/*************************** SERVER SIDE ROUTES ************************/

	//	Pass the JSON with the following fields:
	//	{
	//		dogName: String
	//		location: String
	//		species: String
	//		breed: String
	//		weight: Number
	//	}
	app.post('/addNeededDog', function(req, res){
		var dogPost = new dog({ FosteredDog: {
			dogName : req.body.dogName,
			time_needed_by: (Date.now()/1000)|0,
			location : req.body.location,
			species: req.body.species,
			breed : req.body.breed,
		 	weight: req.body.weight,
			owner_id: null,
			vacc_date : "",
			vacc_info : ""
		}});
		dogPost.save(function(err, json) {
			if(err) return err;
			res.json(201, json);
		});
	});

	// Pass the json in with the following fields: dogId (for the id of the dog) and ownerId (for the new foster).
	//		All fields are strings.
	//	Pass the JSON with the following fields:
	//	{
	//		dogId: String
	//		ownerId: String
	//	}
	app.post('/dogFostered', function(req, res){
		dog.findById(req.body.dogId, function(err, adoptedDog) {
			if(err) {
				res.send(500);
				return err;
			}

			if (adoptedDog === null) {
				res.send(404);
				return;
			}

			if (adoptedDog.FosteredDog.owner_id) {
				res.send(410);
				return;
			}

			foster.findById(req.body.ownerId, function(err, newFoster) {
				if(err) {
					res.send(500);
					return err;
				}

				if (newFoster === null) {
					res.send(404);
					return;
				}

				adoptedDog.FosteredDog.owner_id = req.body.ownerId;
				newFoster.Foster.dogFostered.id = req.body.dogId;
				adoptedDog.save(function(err, json) {
					if(err) return err;
					res.send(204);
				});
				newFoster.save(function(err, json) {
					if(err) return err;
					res.send(204);
				});
			});
		});
	});

	//	Pass the JSON in with the following fields:
	// {
	//		email: String
	//		name: String
	// }
	app.post('/addFoster', function(req, res){
		var fost = new foster({ Foster: {
			main: {
				email: req.body.email,
				name: req.body.name,
				is_approved: false,
				is_admin: false
			},
			preferences : {
				user_location : "",
				time_needed_by : "",
				species: [],
				breed : [],
				weightRange : { min: -1, max: -1 },
				ageRange : { min: -1, max: -1 }
			},
			dogFostered : {
				dogInfo : {
					id: "",
					time_adopted : "",
					time_until : "",
				}
			}
		}});

		fost.save(function(err, json) {
			if (err) return err;
			res.json(201, json);
		});
	});

	app.get('/getDogList', function(req, res){
		dog.find(function(err, dogs) {
			res.json(dogs);
		}).sort({ time_needed_by : 'asc' });
	});

	app.get('/getFosterList', function(req, res) {
		foster.find(function(err, fosters) {
			res.json(fosters);
		});
	});
	// Pass the json in with the following fields:
	// {
	// user_location: String
	// time_needed_by: String
	// species: string
	// breed: String
	// weight_range: { min: Number, max: Number }    (-1 for both if no preference)
	// age_range: { min: Number, max: Number }       (-1 for both if no preference)
	// }
	app.post('/updateFosterPreferences', function(req, res){
			req.user.Foster.preferences.user_location = req.body.user_location;
			req.user.Foster.preferences.time_needed_by = req.body.time_needed_by;
			req.user.Foster.preferences.species = req.body.species;
			req.user.Foster.preferences.breed = req.body.breed;
			req.user.Foster.preferences.weight_range = {
				min: req.body.weight_range.min,
				max: req.body.weight_range.max
			};
			req.user.Foster.preferences.age_range = {
				min: req.body.age_range.min,
				max: req.body.age_range.max
			};

			req.user.save(function(err, json) {
				if(err) return err;
				res.json(204, json);
			});
	});

	// Pass the JSON in with the following fields:
	//{
	//	dogId: String
	//	vacc_date: Number
	//	vacc_info: String
	//}
	app.post('/updateVaccination', function(req, res) {
		dog.findById(req.body.dogId, function(err, vaccinatedDog) {
			if(err) {
				res.send(500);
				return err;
			}
			if (!vaccinatedDog) {
				res.send(404);
				return;
			}
			vaccinatedDog.FosteredDog.vacc_date = req.body.vacc_date;
			vaccinatedDog.FosteredDog.vacc_info = req.body.vacc_info;
			vaccinatedDog.save(function(err, json) {
				if(err) return err;
				res.send(204);
			});
		});
	});

	// body of request: { fosterId: <id of the fosterer that is supposed to be confirmed> }
	app.post('/confirmUser', isLoggedIn, function(req, res) {
		foster.findById(req.body.fosterId, function(err, confirmee) {
			if (err) {
				res.send(500);
				return err;
			}

			if (!confirmee) {
				res.send(404);
				return;
			}

			if (confirmee.Foster.is_approved) {
				res.send(410);
				return;
			}

			confirmee.Foster.is_approved = true;
			res.send(204);
		});
	});

	// TODO steven: add authentication middleware
	app.get('/getApplicableDogs', function(req, res) {
		dog.find(function(err, dogList) {
			if (err) {
				res.send(500);
				return err;
			}

			var userSpeciesPreferences = req.user.Foster.preferences.species;
			var userBreedPreferences = req.user.Foster.preferences.breed;
			var maxWeight = req.user.Foster.preferences.weight_range.max;
			var minWeight = req.user.Foster.preferences.weight_range.min;
			var maxAge = req.user.Foster.preferences.age_range.max;
			var minAge = req.user.Foster.preferences.age_range.min;
			var possibleDogs = [];

			dogList.forEach(function(dog) {
				if(userSpeciesPreferences.indexOf(dog.FosteredDog.species) == -1) {
					return;
				}
				if (userBreedPreferences.indexOf(dog.FosteredDog.breed) == -1) {
					return;
				}

				if (maxWeight > -1 && minWeight > -1) {
					if (dog.FosteredDog.weight > maxWeight ||
						dog.FosteredDog.weight < minWeight) {
						return;
					}
				}

				if (maxAge > -1 && minAge > -1) {
					if (dog.FosteredDog.age > maxAge ||
						dog.fosteredDog.age < minAge) {
						return;
					}
				}

				possibleDogs.push(dog);
			});

			req.json(200, possibleDogs);
		});
	});

	//	Pass the JSON in with the following field:
	//	{
	//		dogId: String
	//	}
	app.delete('/removeDog', function(req, res) {
		dog.findByIdAndRemove(req.body.dogId, function(err) {
			if(err) return err;
			res.send(204);
		});
	});

	//	Pass the JSON in with the following field:
	//	{
	//		fosterId: String
	//	}
	app.delete('/removeFoster', function(req, res) {
		foster.findByIdAndRemove(req.body.fosterId, function(err) {
			if(err) return err;
			res.send(204);
		});
	});

	/*************************** EXTRA ************************/
	// MIDDLEWARE TO CHECK IF USER IS ALREADY LOGGED IN
	function isLoggedInAuth(req, res, next) {

		// if user is authenticated in the session, carry on
		if (req.isAuthenticated() && req.user.isAdmin)
			return next();

		// if they aren't redirect them to the home page
		res.redirect('/login');
	}
	
	function isLoggedIn(req, res, next) {		
		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return next();

		// if they aren't redirect them to the home page
		res.redirect('/login');
	}
};
