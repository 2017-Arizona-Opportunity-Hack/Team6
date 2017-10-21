// -------------------------------------------------------------------------------//
// ---------------------- MONGOOSE SCHEMA FOR STORING BILLS ------------------------//
// -------------------------------------------------------------------------------//

var mongoose = require('mongoose');

var schema = mongoose.Schema({
        Admin : {
                google : {
                    id : String,
                    token : String,
                    email : String,
                    name : String,
				}}});

module.exports = mongoose.model('Admin', schema);