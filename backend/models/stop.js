var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Stop', new Schema({ 
	name: String,
	schedule: String,
    position: Array,
	line: mongoose.Schema.Types.ObjectId
}));
