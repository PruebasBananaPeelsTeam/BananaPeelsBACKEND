import User from '../models/User.js';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userFound = await User.findOne({ email: email.toLowerCase() });
        const isMatch = await bcrypt.compare(password, userFound.password);

        console.log('userFound:', userFound);
        console.log('isMatch:', isMatch);

        if (!userFound || !isMatch) {
            next(createError(401, 'Invalid Credentials 😢'));
            return;
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
        console.log(error);
        next(createError(500, 'Internal server error'));
    }
};
