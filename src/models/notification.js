var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var NotificationSchema   = new Schema({
    _id: String,
    type: String,
    title: String,
    action: String,
    message: String,
    metadata: String,
    time: { type: Date, default: Date.now },
    source: String
});

module.exports = mongoose.model('notifications', NotificationSchema);