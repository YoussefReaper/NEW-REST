const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    style: String,
    price: {type: Number, default: 0},
    isLimited: {type:Boolean, default: false},
    stock: { type: Number, default: null },
    rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
    deadline: { type: Date, default: null }
});

module.exports = mongoose.model('Tag', tagSchema);