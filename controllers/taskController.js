const Task = require('../models/Task');
const User = require('../models/User');

exports.createTask = async (req, res) => {
    const { title, description, dueDate, priority } = req.body;
    if (!title) return res.status(400).json({message: 'Title required'});

    const ownerId = req.user?.id || req.user?._id;
    if (!ownerId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const task = new Task({
            ownerType: 'user',
            ownerId,
            title,
            description: description || '',
            dueDate: dueDate ? new Date(dueDate): null,
            priority: priority || 'medium'
        });
        await task.save();
        await User.findByIdAndUpdate(ownerId, { $push: { tasks: task._id}});
        res.status(201).json({ message: 'Task created', task});
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.getTasks = async (req, res) => {
    const {status, sortBy} = req.query;
    const ownerId = req.user?.id || req.user?._id;
    if (!ownerId) return res.status(401).json({ message: 'Unauthorized' });

    try{
        const filter = { ownerType: 'user', ownerId };
        if (status === 'completed') filter.completed = true;
        if (status === 'pending') filter.completed = false;

        let query = Task.find(filter);
        if (sortBy === 'due') query = query.sort({dueDate: 1});
        else if (sortBy === 'priority') query = query.sort({ priority: -1});
        const tasks = await query.exec();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.updateTask = async (req, res) => {
    const taskId = req.params.id;
    const { title, description, dueDate, completed, progress, priority } = req.body;
    if (!taskId) return res.status(400).json({message: 'id required'});

    const ownerId = req.user?.id || req.user?._id;
    if (!ownerId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const task = await Task.findOne({ _id: taskId, ownerType: 'user', ownerId });
        if (!task) return res.status(404).json({message: 'Task not found'});
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
        if (completed !== undefined) task.completed = completed;
        if (progress !== undefined) task.progress = progress;
        if (priority !== undefined) task.priority = priority;

        await task.save();
        res.json({message: 'Task updated', task});
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.deleteTask = async (req, res) => {
    const taskId = req.params.id;
    if (!taskId) return res.status(400).json({message: 'id required'});

    const ownerId = req.user?.id || req.user?._id;
    if (!ownerId) return res.status(401).json({ message: 'Unauthorized' });

    try{
        const task = await Task.findOneAndDelete({ _id: taskId, ownerType: 'user', ownerId });
        if (!task) return res.status(404).json({message: 'Task not found'});
        await User.findByIdAndUpdate(ownerId, {$pull: { tasks: task._id}});
        res.json({message: 'Task deleted'});
    }catch(err) {
        res.status(500).json({ message: 'Server error', error: err.message});
    }
};