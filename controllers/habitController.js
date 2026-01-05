const User = require('../models/User');
const Habit = require('../models/Habit');

exports.addHabit = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { type, habit, name, description, frequency, goal } = req.body;
        const habitName = name || habit;

        if (!type || !habitName) {
            return res.status(400).json({ message: 'type and habit (or name) are required' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const habitDoc = new Habit({
            userId,
            name: habitName,
            type,
            description,
            frequency,
            goal
        });
        await habitDoc.save();

        user.habits = user.habits || [];
        user.habits.push(habitDoc._id);
        await user.save();

        res.status(201).json(habitDoc);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.removeHabit = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { id, type, habit, name } = req.body;
        let habitDoc = null;

        if (id) {
            habitDoc = await Habit.findOne({ _id: id, userId });
        } else {
            const habitName = name || habit;
            if (!type || !habitName) {
                return res
                    .status(400)
                    .json({ message: 'Provide id, or provide type and habit (or name)' });
            }
            habitDoc = await Habit.findOne({ userId, type, name: habitName });
        }

        if (!habitDoc) return res.status(404).json({ message: 'Habit not found' });

        await Habit.deleteOne({ _id: habitDoc._id, userId });
        await User.updateOne({ _id: userId }, { $pull: { habits: habitDoc._id } });

        res.status(200).json({ message: 'Habit removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getHabits = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const filter = { userId };
        if (req.query?.type) filter.type = req.query.type;

        const habits = await Habit.find(filter).sort({ createdAt: -1 });
        res.status(200).json(habits);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};