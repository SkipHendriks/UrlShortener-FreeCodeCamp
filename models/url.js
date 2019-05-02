var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
    url: String,
    short_url: { type: Number, min: 1000, max: 9999 }
});

module.exports = mongoose.model('Url', UrlSchema);