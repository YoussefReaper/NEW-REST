const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    key: String,
    value: mongoose.Schema.Types.Mixed,
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Memory', memorySchema);