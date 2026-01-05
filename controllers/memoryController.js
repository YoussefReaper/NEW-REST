const Memory = require('../models/Memory');

exports.upsertMemory = async (req, res) => {
    const {key,value} = req.body;
    if (!key) return res.status(400).json({message: 'key required'});

    try {
        let mem = await Memory.findOne({userId: req.user.id, key});
        if (mem) {
            mem.value = value;
            mem.updatedAt = new Date();
            await mem.save();
        } else {
            mem = new Memory({userId: req.user.id, key, value});
            await mem.save();
        }
        res.json({message: 'Memory saved', memory: mem});
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.getAllMemories = async (req, res) => {
    try {
        const mems = await Memory.find({userId: req.user.id});
        res.status(200).json(mems);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.deleteMemory = async (req, res) => {
    const {key} = req.params;
    try {
        const mem = await Memory.findOneAndDelete({userId: req.user.id, key});
        if (mem) {
            res.status(200).json({message: 'Memory deleted'});
        } else {
            res.status(404).json({message: 'Memory not found'});
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message});
    }
};