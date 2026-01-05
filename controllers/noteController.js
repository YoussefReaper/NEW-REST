const Note = require('../models/Note');

exports.createNote = async (req,res) => {
    try {
        const { title, content, tags, images, files, linkedNotes } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'title and content are required' });
        }

        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const note = new Note({
            userId,
            title,
            content,
            tags,
            images,
            files,
            linkedNotes
        });
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getNotes = async (req, res) => {
    try{
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const notes = await Note.find({ userId }).populate('linkedNotes');
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getNoteById = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const note = await Note.findOne({ _id: req.params.id, userId }).populate('linkedNotes');
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const updates = { ...req.body, updatedAt: new Date() };
        delete updates.userId;

        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, userId },
            updates,
            { new: true }
        );
        if (!note) return res.status(404).json({ message: 'Note not found'});
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const deleted = await Note.findOneAndDelete({ _id: req.params.id, userId });
        if (!deleted) return res.status(404).json({ message: 'Note not found'});
        res.json({ message: 'Note deleted'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};