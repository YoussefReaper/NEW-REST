const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {type: String, required: true},
    content: {type: String, required: true},
    tags: [{type: String}],
    images: [{type: String}],
    files: [{
        name: String,
        type: String,
        url: String
    }],
    linkedNotes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {timestamps: true})

module.exports = mongoose.model('Note', noteSchema)