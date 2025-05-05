// controllers/deleteUserController.js
import User from '../models/User.js';
import Advert from '../models/Advert.js';

export const deleteUser = async (req, res) => {
  try {
    const userIdFromToken = req.user._id;
    const { userId: userIdFromBody } = req.body;

    // Autorización: solo se permite eliminar al usuario autenticado
    if (userIdFromBody && userIdFromBody !== userIdFromToken.toString()) {
      return res.status(403).json({ error: 'Unauthorized to delete this user' });
    }

    // Borrar todos los anuncios creados por el usuario
    await Advert.deleteMany({ ownerId: userIdFromToken });

    // Borrar usuario
    await User.findByIdAndDelete(userIdFromToken);

    res.status(200).json({
      message: 'User and adverts deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};
