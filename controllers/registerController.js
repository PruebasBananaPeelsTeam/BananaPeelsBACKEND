import User from '../models/User.js';
import createError from 'http-errors';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    username: z.string().min(1, 'Username is required'),
});

export async function createUser(req, res, next) {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { email, password, username } = validatedData;

        // Hashear contraseña usando el método estático
        const hashedPassword = await User.hashPassword(password);

        // Crear una instancia de usuario
        const user = new User({
            email,
            password: hashedPassword, 
            username,
        });

        // Guardar en la base de datos
        await user.save();

        // Respuesta de éxito
        res.status(201).json({
            message: 'User created successfully',
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
                createError(400, err.errors.map((e) => e.message).join(', '))
            );
        }
        next(err);
    }
}
