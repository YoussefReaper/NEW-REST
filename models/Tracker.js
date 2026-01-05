const mongoose = require('mongoose');

const trackerSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    // Legacy aggregate fields (kept for backward compatibility)
    trackerHours: { type: Number, default: 0 },
    completedTasksCount: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },

    // Used by trackerController.js
    entries: [
        {
            date: { type: Date, required: true },
            trackedHours: { type: Number, default: 0 },
            completedTasksCount: { type: Number, default: 0 }
        }
    ]
});

module.exports = mongoose.model('Tracker', trackerSchema);