const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true},
    description: String,
    milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' }],
    notes: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Note'}
    ],
    references: {
        links: [String],
        books: [String]
    },
    attachments: [
        {
            type: {type: String, enum: ['image', 'pdf', 'link', 'file']},
            url: String
        }
    ],
    createdAt: {type: Date, default: Date.now},
    deadline: Date
});

module.exports = mongoose.model('Plan', planSchema);