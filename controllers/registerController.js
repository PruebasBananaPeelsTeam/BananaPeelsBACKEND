import User from '../models/User.js';
import createError from 'http-errors';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must not exceed 20 characters'),
});

export async function createUser(req, res, next) {
    try {
        const { email, password, username } = registerSchema.parse(req.body);

        const normalizedEmail = email.toLowerCase();

        const existingEmail = await User.findOne({ email: normalizedEmail });
        if (existingEmail) {
            return next(createError(409, 'Email is already in use 😕'));
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return next(createError(409, 'Username is already taken 😕'));
        }

        // Hashear contraseña usando el método estático
        const hashedPassword = await User.hashPassword(password);

        // Crear una instancia de usuario
        const user = new User({
            email: normalizedEmail,
            password: hashedPassword,
            username,
        });

        // Guardar en la base de datos
        await user.save();

        // Respuesta de éxito
        res.status(201).json({
            message: 'User created successfully 🎉',
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        // zod error handler
        if (err instanceof z.ZodError) {
            return next(
                createError(400, err.errors.map((e) => e.message).join(', ')),
            );
        }
        next(err);
    }
}
