// -------------------------------------------------------------------------------//
// ---------------------- MONGOOSE SCHEMA FOR STORING BILLS ------------------------//
// -------------------------------------------------------------------------------//

var mongoose = require('mongoose');

var schema = mongoose.Schema({
        Admin : {
                main : {
					email : String,
					name : String,
					password : String,
                },
        }});

module.exports = mongoose.model('Admin', schema);