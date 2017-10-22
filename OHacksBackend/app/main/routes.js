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

	app.post('/signup', function(req, res, next) {
		passport.authenticate('local-login', {
			successRedirect : '/dogadd',
			failureRedirect : '/signup',
			failureFlash : true,
		});
	});

	// signs the user out of session
	app.get('/logout', function(req, res){
		req.logout();
		res.render('login.ejs');
	});

	app.get('/dogadd', isLoggedIn, function(req, res){
		console.log(req.user);
		res.send("fuck emasdfas");
	});

	/*************************** SERVER SIDE ROUTES ************************/

	app.post('/addNeededDog', function(req, res){
		var dogPost = new dog({ FosteredDog: {
			dogName : req.body.dogName,
			time_needed_by: req.body.time_needed_by,
			location : req.body.location,
			breed : req.body.type,
			size : req.body.size,
			owner_id : req.body.owner_id,
			has_owner : req.body.has_owner,
			vacc_date : req.body.vacc_date,
			vacc_info : req.body.vacc_info
		}});
		dogPost.save(function(err, json) {
			if(err) return err;
			res.json(201, json);
		});
	});

	// req passed in should have dogId for the id of the dog and should have ownerId for the id of the owner
	app.post('/dogFostered', function(req, res){
		dog.findById(req.body.dogId, function(err, adoptedDog) {
			if(err) {
				res.send(404);
				return err;
			}
			foster.findById(req.body.ownerId, function(err, newFoster) {
				if(err) {
					res.send(404);
					return err;
				}
				adoptedDog.owner_id = req.body.ownerId;
				newFoster.dogFostered.id = req.body.dogId;
				adoptedDog.save(function(err, json) {
					if(err) return err;
					res.json(204);
				});
				newFoster.save(function(err, json) {
					if(err) return err;
					res.json(204);
				});
			});
		});
	});

	app.post('/addFoster', function(req, res){
		var fost = new foster({ Foster: {
			main: {
				email: req.body.email,
				name: req.body.name,
				is_approved: false,
			}
		}});

		fost.save(function(err, json) {
			if (err) return err;
			res.json(201, json);
		});
	});

	app.get('/sendNotifToUser', function(req, res){

	});

	app.get('/getDogList', function(req, res){
		dog.find(function(err, dogs) {
			res.json(dogs);
		}).sort("-time_needed_by");
	});

	app.post('/updateFosterPreferences', function(req, res){
		foster.findOne(req.body.email, function(err, currFoster) {
			if(err) {
				res.send(404);
				return err;
			}
			currFoster.preferences.user_location = req.body.user_location;
			currFoster.preferences.time_needed_by = req.body.time_needed_by;
			currFoster.preferences.breed = req.body.breed;
			currFoster.preferences.weightRange = req.body.weightRange;
			currFoster.preferences.ageRange = req.body.ageRange;
			currFoster.save(function(err, json) {
				if(err) return err;
				res.json(204, json);
			});
		});
	});

	app.get('/sendNotificationToAll', function(req, res){

	});

	/*************************** EXTRA ************************/


	// MIDDLEWARE TO CHECK IF USER IS ALREADY LOGGED IN
	function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
                return next();

        // if they aren't redirect them to the home page
        res.redirect('/login');
	}
};
