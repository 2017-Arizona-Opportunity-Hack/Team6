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

	app.get('/dogadd', isLoggedIn, function(req, res){
		res.send(req.admin);
	});

	/************************ GOOGLE PLUS AUTHENTICATION ***********************/

	// profile gets us their basic information including their name
	// email gets their emails
	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

	// the callback after google has authenticated the user
	app.get('/auth/google/callback',
			passport.authenticate('google', {
					successRedirect : '/dogadd',
					failureRedirect : '/login'
			}));

	/*************************** SERVER SIDE ROUTES ************************/

	app.post('/addNeededDog', function(req, res){
		dogPost = new dog({
			time_needed_by: req.body.time_needed_by,
			location : req.body.location,
			type : req.body.type,
			size : req.body.size,
			owner_id : req.body.owner_id,
			has_owner : req.body.has_owner,
			vaccination : {
				vaccDate : req.body.vaccDate,
				info : req.body.info
			}
		});
		dogPost.save(function(err, dogPost) {
			if(err) return err;
			res.json(dogPost);
		});

		// dog.create(req.body, function(err, post) {
		// 	if(err) return err;
		// 	res.json(post);
		// });
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
			preferences: req.body.preferences
		});
		fosterPreference.save(function(err, fosterPreference) {
			if(err) return err;
			res.json(fosterPreference);
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
