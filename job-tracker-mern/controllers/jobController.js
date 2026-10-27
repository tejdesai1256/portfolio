const Job = require('../models/Job');

// GET /api/jobs (Supports search, status filter, and pagination)
exports.getAllJobs = async (req, res) => {
    try {
        const { status, search, sort } = req.query;
        const queryObject = { createdBy: req.user.userId };

        if (status && status !== 'all') {
            queryObject.status = status;
        }

        if (search) {
            queryObject.$or = [
                { company: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } }
            ];
        }

        let result = Job.find(queryObject);

        if (sort === 'latest') {
            result = result.sort('-appliedDate');
        } else if (sort === 'oldest') {
            result = result.sort('appliedDate');
        } else {
            result = result.sort('-createdAt');
        }

        const jobs = await result;
        res.status(200).json({ count: jobs.length, jobs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/jobs/stats (Calculates KPI metrics)
exports.getJobStats = async (req, res) => {
    try {
        const stats = await Job.aggregate([
            { $match: { createdBy: req.user.userId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const defaultStats = {
            wishlist: 0,
            applied: 0,
            interviewing: 0,
            offered: 0,
            rejected: 0
        };

        stats.forEach(item => {
            defaultStats[item._id] = item.count;
        });

        const total = Object.values(defaultStats).reduce((a, b) => a + b, 0);

        res.status(200).json({ defaultStats, total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/jobs
exports.createJob = async (req, res) => {
    try {
        req.body.createdBy = req.user.userId;
        const job = await Job.create(req.body);
        res.status(201).json({ job });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PATCH /api/jobs/:id
exports.updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findOneAndUpdate(
            { _id: id, createdBy: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!job) {
            return res.status(404).json({ error: `No job found with ID ${id}` });
        }

        res.status(200).json({ job });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findOneAndDelete({ _id: id, createdBy: req.user.userId });

        if (!job) {
            return res.status(404).json({ error: `No job found with ID ${id}` });
        }

        res.status(200).json({ message: 'Job application deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
