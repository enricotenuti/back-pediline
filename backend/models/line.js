var mongoose = require('mongoose');
const school = require('./school');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Line', new Schema({ 
	name: String,
	color: String,
	// id: mongoose.Schema.Types.ObjectId,
    stops: Array,
	schoolId: String

}));