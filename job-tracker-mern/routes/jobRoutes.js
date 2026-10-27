const express = require('express');
const router = express.Router();
const {
    getAllJobs,
    getJobStats,
    createJob,
    updateJob,
    deleteJob
} = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');

// Protect all job endpoints with JWT middleware
router.use(authMiddleware);

router.route('/')
    .get(getAllJobs)
    .post(createJob);

router.route('/stats')
    .get(getJobStats);

router.route('/:id')
    .patch(updateJob)
    .delete(deleteJob);

module.exports = router;
