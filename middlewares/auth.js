import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Middleware para proteger rutas
export const authMiddleware = async (req, res, next) => {
    try {
        // obtenemos token del header de la peticion
        const token = req.headers.authorization?.replace('Bearer ', '');
        // si no hay token, devuelve error 401 (no autorizado)
        if (!token) {
            return res.status(401).json({ error: 'Token required' });
        }
        // verificamos el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Buscamos el user en la DB con ID del token
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'user not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        // si el token es invalido, devolvemos un error 401
        res.status(401).json({ error: 'Invalid Token' });
    }
};
