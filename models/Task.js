const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    ownerType: { type: String, enum: ['user', 'team'], required: true},
    ownerId: {type: mongoose.Schema.Types.ObjectId, refPath: 'ownerType', required: true},
    title: {type: String, required: true},
    description: String,
    dueDate: Date,
    completed: {type: Boolean, default: false},
    completedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    completedAt: Date,
    progress: {type: Number, default: 0},
    priority: {type: String, enum: ['low', 'medium', 'high'], default: 'medium'},
    requiresUpload: {type: Boolean, default: false},
    uploads: [
        {
            uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            url: String,
            uploadedAt: { type: Date, default: Date.now }
        }
    ],
    repeat: {
        type: { type: String, enum: ['none', 'daily', 'weekly', 'monthly', 'custom'], default: 'none' },
        customDays: [String]
    },

    attachments: [
        {
            type: {type: String, enum: ['image', 'pdf', 'link', 'file']},
            url: String
        }
    ],
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subTasks: [{
        title: String,
        completed: {type: Boolean, default: false},
        completedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        completedAt: Date,
        requiredsUpload: {type: Boolean, default: false},
        uplaods: [
            {
                uploadedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
                url: String,
                uploadedAt: {type: Date, default: Date.now}
            }
        ]
    }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);