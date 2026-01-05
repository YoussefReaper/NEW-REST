const Plan = require('../models/Plan');

exports.createPlan = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        if (!req.body?.name) {
            return res.status(400).json({ message: 'name is required' });
        }

        const plan = new Plan({
            ...req.body,
            userId
        });
        await plan.save();
        res.status(201).json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};

exports.getPlans = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const plans = await Plan.find({ userId })
            .populate('milestones')
            .populate('notes');
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPlanById = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const plan = await Plan.findOne({ _id: req.params.id, userId })
            .populate('milestones')
            .populate('notes');
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePlan = async (req, res) => {
    try{
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const plan = await Plan.findOneAndUpdate(
            {_id: req.params.id, userId},
            req.body,
            {new: true}
        );
        if (!plan) return res.status(404).json({ message: 'Plan not found'});
        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const deleted = await Plan.findOneAndDelete({ _id: req.params.id, userId });
        if (!deleted) return res.status(404).json({ message: 'Plan not found'});
        res.json({ message: 'Plan deleted'});
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};
