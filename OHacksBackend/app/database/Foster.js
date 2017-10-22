// -------------------------------------------------------------------------------//
// ---------------------- MONGOOSE SCHEMA FOR STORING BILLS ------------------------//
// -------------------------------------------------------------------------------//

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var schema = mongoose.Schema({
	Foster : {
		isAdmin : Boolean, 
		main : {
			email : String,
			password : String,
			is_approved: Boolean,
		},
		preferences : {
			user_location : String,
			time_needed_by : String,
			breed : [String],
			weightRange : String,
			ageRange : String
		},
		dogFostered : {
			dogInfo : {
				id: String,
				time_adopted : String,
				time_until : String,
			}
		},
	}});

schema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.Foster.main.password);
};
	
module.exports = mongoose.model('Foster', schema);
