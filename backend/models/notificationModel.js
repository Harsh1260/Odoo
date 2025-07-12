const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['NEW_ANSWER', 'ACCEPTED_ANSWER', 'MENTION'], required: true },
    relatedQuestion: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);