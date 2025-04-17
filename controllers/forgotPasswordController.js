import crypto from 'crypto';
import User from '../models/User.js';
import { sendResetPasswordEmail } from '../lib/mailer.js';

export const forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(200).json({ message: 'If this email is registered, you will receive a password reset link.' })
        }

        const token = crypto.randomBytes(32).toString('hex')
        const expiration = Date.now() + 3600000

        user.resetPasswordToken = token
        user.resetPasswordExpires = expiration
        await user.save()

        await sendResetPasswordEmail(email, token)

        res.status(200).json({ message: 'Password reset link sent to your email.' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error sending password reset email.' })
        
    }
}