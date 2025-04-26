import User from '../models/User.js';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
    username: z
        .string()
        .min(1, 'Username is required (min 1)')
        .max(25, 'Username is Too long (max 25)')
        .trim()
        .regex(
            /^[a-zA-Z0-9_.-]*$/,
            'Only letters, numbers, underscores, dots and hyphens are allowed',
        ),
    password: z.string().min(4),
});

export const login = async (req, res, next) => {
    try {
        const { username, password } = loginSchema.parse(req.body);
        const userFound = await User.findOne({ username });

        if (!userFound) {
            return next(createError(401, 'Invalid Credentials 😢'));
        }

        const isMatch = await userFound.comparePassword(password);

        if (!isMatch) {
            return next(createError(401, 'Invalid Credentials 😢'));
        }

        jwt.sign(
            { _id: userFound._id },
            process.env.JWT_TOKEN,
            {
                expiresIn: '2d',
            },
            (err, tokenJWT) => {
                if (err) {
                    next(err);
                    return;
                }
                res.json({
                    tokenJWT,
                    user: {
                        _id: userFound._id,
                        username: userFound.username,
                        email: userFound.email
                    },
                });
            },
        );
    } catch (error) {
        // zod error handler
        if (error instanceof z.ZodError) {
            return next(
                createError(400, error.errors.map((e) => e.message).join(', ')),
            );
        }
        console.log(error);
        next(createError(500, 'Internal server error'));
    }
};
