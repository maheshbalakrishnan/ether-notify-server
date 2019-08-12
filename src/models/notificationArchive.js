var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var NotificationArchiveSchema   = new Schema({
    _id: String,
    oldId: String,
    type: String,
    title: String,
    action: String,
    message: String,
    metadata: String,
    time: { type: Date, default: Date.now },
    archived: { type: Date, default: Date.now },
    source: String
});

module.exports = mongoose.model('notification_archive', NotificationArchiveSchema);