// -------------------------------------------------------------------------------//
// ---------------------- MONGOOSE SCHEMA FOR STORING BILLS ------------------------//
// -------------------------------------------------------------------------------//

var mongoose = require('mongoose');

var schema = mongoose.Schema({
        FosteredDog : {
			time_needed_by : String,
			location : String,
			type : String,
			size : String,
			owner_id : String,
			has_owner : Boolean,
			vaccination : {
				vaccDate : String,
				info : String
			}
        }});

module.exports = mongoose.model('FosteredDog', schema);
