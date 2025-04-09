import User from '../models/User.js';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
});

export const login = async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const userFound = await User.findOne({ email: email.toLowerCase() });

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
                res.json({ tokenJWT });
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
