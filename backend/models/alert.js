var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Alert', new Schema({ 
	title: String,
    description: String,
    date: String,
    author: String,
}));
