const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: {type: String, required: true},
    type: {type:String, enum: ['good', 'bad'], required: true},
    description: {type: String},
    tags: [{ type: String }],
    frequency: {
        unit: {type: String, enum: ['daily', 'weekly', 'monthly', 'custom'], default: 'daily'},
        times: {type: Number, default: 1},
        daysOfWeek: [{type: Number}],
        endAt: {type: Date, default: null}
    },
    progress: [
        {
            date: { type: Date, default: Date.now },
            completed: { type: Boolean, default: false },
            count: { type: Number, default: 0 }
        }
    ],
    streak: {type: Number, default: 0},
    longestStreak: {type: Number, default: 0},
    reminders: [
        {
            time: String,
            message: String
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Habit', habitSchema);