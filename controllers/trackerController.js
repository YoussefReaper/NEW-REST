const Tracker = require('../models/Tracker');
const moment = require('moment');

exports.logEntry = async (req, res) => {
    const {date, trackedHours, completedTasksCount} = req.body;
    const day = date ? new Date(date) : new Date();
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        let tracker = await Tracker.findOne({ userId });
        if (!tracker) {
            tracker = new Tracker({ userId, entries: []});
        }

        if (!Array.isArray(tracker.entries)) tracker.entries = [];

        const idx = tracker.entries.findIndex(e => {
            const eDate = new Date(e.date);
            return eDate.getFullYear() === dayStart.getFullYear() &&
                   eDate.getMonth() === dayStart.getMonth() &&
                   eDate.getDate() === dayStart.getDate();
        });

        if (idx >= 0) {
            if (trackedHours !== undefined) tracker.entries[idx].trackedHours = trackedHours;
            if (completedTasksCount !== undefined) tracker.entries[idx].completedTasksCount = completedTasksCount;
        } else {
            tracker.entries.push({
                date: dayStart,
                trackedHours: trackedHours || 0,
                completedTasksCount: completedTasksCount || 0
            });
        }
        await tracker.save();
        res.status(201).json({ message: 'Tracker entry saved', tracker});
    } catch(err) {
        res.status(500).json({ message: 'Server error', error: err.message});
    }
};

exports.getTracker = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const tracker = await Tracker.findOne({userId});
        if (!tracker) return res.json({ entries: []});
        res.json(tracker);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};