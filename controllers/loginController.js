// import User from '../models/User.js'
import createError from 'http-errors';
import bcrypt from 'bcryptjs';

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const userFound = await User.findOne({ email: email.toLowerCase() });
        const isMatch = await bcrypt.compare(password, userFound.password);

        if (!userFound || !isMatch) {
            next(createError(401, 'Invalid Credentials 😢'));
            return;
        }

        res.json({ message: 'Login success' });
    } catch (error) {
        console.log(error);
        next(createError(500, 'Internal server error'));
    }
};
