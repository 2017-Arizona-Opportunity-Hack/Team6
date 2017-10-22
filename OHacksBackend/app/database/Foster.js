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
			is_admin: Boolean
		},
		preferences : {
			user_location : String,
			time_needed_by : String,
			species: [String],
			breed : [String],
			weight_range : { min: Number, max: Number },
			age_range : { min: Number, max: Number }
		},
		dogFostered : {
			dogInfo : {
				id: String,
				time_adopted : Number,
				time_until : Number,
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
