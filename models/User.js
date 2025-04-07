import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true, // createdAt and updatedAt
    },
);

userSchema.statics.hashPassword = function (unencryptedPassword) {
    return bcrypt.hash(unencryptedPassword, 7);
};

// check the user's password
userSchema.methods.comparePassword = function (passwordToCompare) {
    return bcrypt.compare(passwordToCompare, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
