// -------------------------------------------------------------------------------//
// ---------- HANDLES AUTHENTICATION OF THE USER THROUGH PASSPORT ----------------//
// -------------------------------------------------------------------------------//

var LocalStrategy = require('passport-local').Strategy;
var User = require('../database/User.js');
var Foster = require('../database/Foster.js');

module.exports = function(passport, auth) {
	// USER SERIALIZATION OR DESERIALIZATION
				
	// IF USER SESSION EXISTS, SERIALIZE 
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
	
	// IF USER SESSION DOES NOT EXIST, SERIALIZE FROM DATABASE
	passport.deserializeUser(function(id, done) {
		// FIND USER ID HERE AND RETURN USER SESSION
		User.findById(id, function(err, user){
			if (!(user === null)){
				done(err, user);
			}
			else{
				Foster.findById(id, function(err, user){
					done(err, user);
				});
			}
		});
	});
		
	// ================ ANDROID SIGNUP MODULES =============
	
	passport.use('android-login', new LocalStrategy(
		/**{
			usernameField : 'login',
			passwordField : 'password',
			passReqToCallback: true
		},**/
		function(req, username, pass, done){
			process.nextTick(function(){
				Foster.findOne({ 'Foster.main.email' : username }, function(err, user){					
					if (err)
						return done(err);
					
					if (!user)
						return done(null, false, req.flash('loginMessage', "No User Found"));
					
					if (!user.validPassword(pass))
						return done(null, false, req.flash('loginMessage', "Wrong Password"));
					
					return done(null, user);
				});
			});
	}));
	
	passport.use('android-signup', new LocalStrategy({
	function(username, pass, done){		
		Foster.findOne({ 'Foster.main.email' : username }, function(err, user){					
					if (err){
						return done(err);
					}
					if (user){
						return done(null, false);
					}
					else {
						var fost = new Foster();
					
						var data = {
							isAdmin : false,
							main: {
								email: username,
								password: fost.generateHash(pass),
								is_approved: false,
							},
							preferences : {
								user_location : "",
								time_needed_by : "",
								breed : [String],
								weightRange : "",
								ageRange : ""
							},
							dogFostered : {
								dogInfo : {
									id: "",
									time_adopted : "",
									time_until : "",
								}
							}
						};
						
						fost.Foster = data;

						fost.save(function(err, json) {							
							if (err)
								throw err;
							return done(null, fost);
						});
					}
				});
	}));
	
	// ================= WEB SIGNUP MODULES ===================== 

	
	// passport handling signup (WEB)
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'login',
		passwordField : 'password',
		passReqToCallback: true
		}, 
		function (req, email, password, done){
			
			process.nextTick(function(){
				User.findOne({ 'User.local.email' : email }, function(err, user){					
					if (err){
						return done(err);
					}
					
					if (user){
						return done(null, false, req.flash('signupMessage', 'Entered Email Already Exists'));
					}
					else {
						var newUser = new User();
																						
						newUser.local.email = email;
						newUser.local.password = newUser.generateHash(password);
						newUser.isAdmin = true;
						
						newUser.save(function(err){
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});
			});
		}
	));
	
	// passport handling for login (WEB)
	passport.use('local-login', new LocalStrategy({
		usernameField : 'login',
		passwordField : 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		User.findOne({'local.email' : email}, function (err, user){
			if (err)
				return done(err);
			
			if (!user)
				return done(null, false, req.flash('loginMessage', "No User Found"));
			
			if (!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', "Wrong Password"));
			
			return done(null, user);
		});
	}
	));
};

