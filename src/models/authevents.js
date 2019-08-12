var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AuthEventsSchema   = new Schema({
    _id: String,
    username: String,
    time: { type: Date, default: Date.now },
    location: String,
    success: Boolean,
    request: String
});

module.exports = mongoose.model('auth_events', AuthEventsSchema);