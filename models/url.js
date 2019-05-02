var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
    original_url: String,
    num: { type: Number, min: 1000, max: 9999 }
});

module.exports = mongoose.model('Url', UrlSchema);