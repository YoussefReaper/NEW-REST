const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    planId: {type: mongoose.Schema.Types.ObjectId, ref: 'Plan'},
    name: {type: String, required: true},
    description: String,
    progress: {type: Number, default: 0},
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    createdAt: {type: Date, default: Date.now},
    deadline: Date,
    attachments: [
        {
            type: {type: String, enum: ['image', 'pdf', 'link', 'file']},
            url: String
        }
    ],
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Note'
        }
    ]
});

module.exports = mongoose.model('Milestone', milestoneSchema);