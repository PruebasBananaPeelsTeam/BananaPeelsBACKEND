import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para proteger rutas
export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('❌ JWT error:', error.message);
        res.status(401).json({ error: 'Invalid Token' });
    }
};
