import User from "../models/User.js";
import bcrypt from "bcrypt";

export const resetPassword = async (req,res) => {
    const { token, password } = req.body

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        })

        if (!user) {
            return res.status(400).json({ error: 'invalid token' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        res.status(200).json({ message: 'Password updated successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'reset password error' })
        
    }
}