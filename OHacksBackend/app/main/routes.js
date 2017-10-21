// -------------------------------------------------------------------------------//
// ---------------------- HANDLES ROUTES FROM THE CLIENT ------------------------//
// -------------------------------------------------------------------------------//

var dog = require('../database/FosteredDog.js');
var foster = require('../database/Foster.js');

module.exports = function(app, passport) {

	/************************ ROUTES FOR RENDERING PAGES ***********************/

	// home page
	app.get('/', function(req, res){
		res.send("hello");
	});

	// login page; google plus auth
	app.get('/login', function(req, res){
		res.render('login.ejs');
	});

	// signs the user out of session
	app.get('/logout', function(req, res){
		req.logout();
		res.render('login.ejs');
	});

	app.get('/dogadd', function(req, res){

	});

	/************************ GOOGLE PLUS AUTHENTICATION ***********************/

	// profile gets us their basic information including their name
	// email gets their emails
	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

	// the callback after google has authenticated the user
	app.get('/auth/google/callback',
			passport.authenticate('google', {
					successRedirect : '/dashboard',
					failureRedirect : '/login'
			}));

	/*************************** SERVER SIDE ROUTES ************************/

	app.post('/addNeededDog', function(req, res){
	//	dog.create(req.body, function(err, post) {
	//		if(err) return err;
	//		res.json(post);
	//	});
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
