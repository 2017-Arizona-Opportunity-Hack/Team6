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
      is_admin: Boolean
		},
		preferences : {
			user_location : String,
			time_needed_by : String,
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

module.exports = mongoose.model('Foster', schema);
