const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, name: user.name },
        process.env.JWT_SECRET || 'careerpulse-secret-key-2026',
        { expiresIn: process.env.JWT_LIFETIME || '30d' }
    );
};

// POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please provide name, email, and password' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user);

        res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email },
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or credentials' });
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateToken(user);
        res.status(200).json({
            user: { id: user._id, name: user.name, email: user.email },
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
