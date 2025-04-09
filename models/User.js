import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

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

//Para devolver la contraseña encriptada: bcrypt.hash() la encripta:
userSchema.statics.hashPassword = function (unencryptedPassword) {
    return bcrypt.hash(unencryptedPassword, 7);
};

// Método de instancia, comprueba que la password que pone el usuario coincide con la del schema:
userSchema.methods.comparePassword = function (passwordToCompare) {
    return bcrypt.compare(passwordToCompare, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
