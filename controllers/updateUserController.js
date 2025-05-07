import User from '../models/User.js';
import Advert from '../models/Advert.js';

export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { email, username, password } = req.body;

    // Verificación de autorización
    if (req.body._id && req.body._id !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized to update this user' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: 'The email is already in use' });
      }
      user.email = email;
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ error: 'The name is already in use' });
      }
      await Advert.updateMany(
        { ownerId: userId },
        {$set:{owner: username}}
      )
      user.username = username;
    }

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
