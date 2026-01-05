const Journal = require('../models/Journal');

exports.createJournal = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const {title, content, mood} = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'title and content are required' });
        }
        const journal = new Journal({
            userId,
            title,
            content,
            mood
        });
        await journal.save();
        res.status(201).json(journal);
    } catch(err) {
        res.status(500).json({ message: err.message});
    }
};

exports.getJournals = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const journals = await Journal.find({ userId });
        res.status(200).json(journals);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};

exports.getJournalById = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const journal = await Journal.findOne({ _id: req.params.id, userId});
        if (!journal) return res.status(404).json({ message: 'Journal not found'});
        res.status(200).json(journal);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};

exports.updateJournal = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const journal = await Journal.findOneAndUpdate(
            { _id: req.params.id, userId },
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        if (!journal) return res.status(404).json({ message: 'Journal not found'});
        res.json(journal);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};

exports.deleteJournal = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const deleted = await Journal.findOneAndDelete({ _id: req.params.id, userId});
        if (!deleted) return res.status(404).json({ message: 'Journal not found'});
        res.status(200).json({ message: 'Journal deleted'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};