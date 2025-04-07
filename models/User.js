import mongoose from 'mongoose';

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
        timestamps: true, // crea campos createdAt y updatedAt
    },
);

const User = mongoose.model('User', userSchema);
export default User;