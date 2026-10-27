const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        trim: true,
        maxlength: 100
    },
    role: {
        type: String,
        required: [true, 'Please provide job role / title'],
        trim: true,
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['wishlist', 'applied', 'interviewing', 'offered', 'rejected'],
        default: 'applied'
    },
    salary: {
        type: String,
        trim: true,
        default: 'Not specified'
    },
    location: {
        type: String,
        trim: true,
        default: 'Remote / Hybrid'
    },
    notes: {
        type: String,
        maxlength: 1000
    },
    jobUrl: {
        type: String,
        trim: true
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Create compound index for fast user query filtering
JobSchema.index({ createdBy: 1, status: 1, appliedDate: -1 });

module.exports = mongoose.model('Job', JobSchema);
