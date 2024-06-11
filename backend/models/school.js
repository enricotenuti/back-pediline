var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('School', new Schema({ 
	name: String,
	linesId: Array,
    position: Array,
	
}));
