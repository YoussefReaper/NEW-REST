const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chatName: { type: String, required: true },
    messages: [
        {
            sender: {type: String, enum: ['ai', 'user']},
            text: String,
            timestamp: { type: Date, default: Date.now}
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);