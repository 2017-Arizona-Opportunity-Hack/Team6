// -------------------------------------------------------------------------------//
// ---------------------- MONGOOSE SCHEMA FOR STORING BILLS ------------------------//
// -------------------------------------------------------------------------------//

var mongoose = require('mongoose');

var schema = mongoose.Schema({
	Foster : {
		main : {
			email : String,
			name : String,
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
				time_adopted : Date,
				time_until : Date,
			}
		},
	}});

module.exports = mongoose.model('Foster', schema);
