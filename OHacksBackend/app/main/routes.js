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
		dog.create(req.body, function(err, post) {
			if(err) return err;
			res.json(post);
		});
	});

	app.post('/fosteredDogFound', function(req, res){

	});

	app.post('/addUser', function(req, res){

	});

	app.get('/sendNotifToUser', function(req, res){

	});

	app.get('/getDogList', function(req, res){
		dog.find(function(err, dogs) {
			res.json(dogs);
		}).sort("-time_needed_by");
	});

	app.post('/addUserPreferences', function(req, res){
		var fosterPreference = new foster({
			fosterPreferences: req.body.preferences
		});
		fosterPreference.save(function(err,post) {
			if(err) return err;
			res.json(post);
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
