var mongoose = require('mongoose');
const school = require('./school');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('User', new Schema({ 
	email: String,
	password: String,
	role: String,
	school	: mongoose.Schema.Types.ObjectId,
	line: mongoose.Schema.Types.ObjectId,
	stop: mongoose.Schema.Types.ObjectId
}));