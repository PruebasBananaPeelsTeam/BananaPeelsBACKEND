// controllers/updateUserController.js
import User from '../models/User.js';

// Controlador para actualizar los datos del usuario
export const updateUser = async (req, res) => {
    try {
        const userId = req.user._id; // El usuario autenticado viene del authMiddleware
        const { email, username, password } = req.body; // Los datos que quiere actualizar

        // Buscar el usuario actual
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Si quiere cambiar el email, verificar que no esté en uso
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res
                    .status(400)
                    .json({ error: 'The email is already in use' });
            }
            user.email = email;
        }

        // Si quiere cambiar el username, verificar que no esté en uso
        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res
                    .status(400)
                    .json({ error: 'The name is already in use' });
            }
            user.username = username;
        }

        // Si quiere cambiar la password, encriptarla
        if (password) {
            user.password = await User.hashPassword(password);
        }

        await user.save();

        res.json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error('❌ Error updating user:', error.message);
        res.status(500).json({ error: 'Error updating user' });
    }
};
