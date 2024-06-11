/* Il codice delle API di List è stato stilato ma non è ancora stato implementato. */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('List', new Schema({ 
	day: String,
	leaders: Array,
    studentsPresent: Array,
    studentsAbsent: Array
}));
