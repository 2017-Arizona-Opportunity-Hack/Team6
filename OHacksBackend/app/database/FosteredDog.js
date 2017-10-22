// -------------------------------------------------------------------------------//
// ---------------------- MONGOOSE SCHEMA FOR STORING BILLS ------------------------//
// -------------------------------------------------------------------------------//

var mongoose = require('mongoose');

var schema = mongoose.Schema({
        FosteredDog : {
      dogName : String,
			time_needed_by : Number,
			location : String,
      species: String,
			breed : String,
			weight : Number,
			owner_id : String,
			vacc_date : Number,
			vacc_info : String
        }});

module.exports = mongoose.model('FosteredDog', schema);
