require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date(),
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'CareerPulse MERN Job Tracker API',
        version: '1.0.0',
        author: 'Tej Desai',
        docs: '/api/jobs (Protected), /api/auth'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

// Connect to MongoDB and start server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerpulse_jobs';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
        app.listen(PORT, () => {
            console.log(`🚀 CareerPulse Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('⚡ Starting server in offline/mock database mode on port', PORT);
        app.listen(PORT, () => {
            console.log(`⚠️ CareerPulse Server running with DB warning on http://localhost:${PORT}`);
        });
    });

module.exports = app;
