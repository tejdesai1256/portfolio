const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication invalid: Missing bearer token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'careerpulse-secret-key-2026');
        req.user = { userId: payload.userId, name: payload.name };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed: Invalid or expired token' });
    }
};

module.exports = authMiddleware;
