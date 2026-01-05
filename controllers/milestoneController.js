const Milestone = require('../models/Milestone');

exports.createMilestone = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const {
            title,
            name,
            description,
            dueDate,
            deadline,
            planId,
            progress,
            tasks,
            attachments,
            notes
        } = req.body;

        const milestoneName = name || title;
        if (!milestoneName) return res.status(400).json({ message: 'name (or title) is required' });

        const milestone = new Milestone({
            userId,
            planId,
            name: milestoneName,
            description,
            progress,
            tasks,
            attachments,
            notes,
            deadline: deadline || dueDate
        });

        await milestone.save();
        res.status(201).json(milestone);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMilestones = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const milestones = await Milestone.find({ userId })
            .populate('tasks')
            .populate('notes');
        res.status(200).json(milestones);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateMilestone = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { title, name, dueDate, deadline, ...rest } = req.body;
        const updates = { ...rest };
        if (name || title) updates.name = name || title;
        if (deadline || dueDate) updates.deadline = deadline || dueDate;
        delete updates.userId;

        const milestone = await Milestone.findOneAndUpdate(
            { _id: req.params.id, userId },
            updates,
            { new: true }
        );

        if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
        res.json(milestone);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteMilestone = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const deleted = await Milestone.findOneAndDelete({ _id: req.params.id, userId });
        if (!deleted) return res.status(404).json({ message: 'Milestone not found' });
        res.status(200).json({ message: 'Milestone deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};