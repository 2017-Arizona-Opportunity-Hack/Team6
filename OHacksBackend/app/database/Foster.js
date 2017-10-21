// -------------------------------------------------------------------------------//
// ---------------------- MONGOOSE SCHEMA FOR STORING BILLS ------------------------//
// -------------------------------------------------------------------------------//

var mongoose = require('mongoose');

var schema = mongoose.Schema({
	Foster : {
		main : {
			email : String,
			name : String,
			password : String,
		},
		preferences : {
			user_location : String,
			time_needed_by : String,
			type : String,
			size : String,
		},
		dogFostered : {
			dogInfo : {
				id: String,
				time_adopted : String,
				time_until : String,
			}
		},
	}});

module.exports = mongoose.model('Foster', schema);
