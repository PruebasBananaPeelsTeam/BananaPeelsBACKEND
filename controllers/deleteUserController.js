import User from "../models/User.js";
import Advert from "../models/Advert.js";

export const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id
        await Advert.deleteMany({ ownerId: userId })
        await User.findByIdAndDelete(userId)
        res.status(200).json({ message: 'User and adverts deleted successfully' })
    } catch (error) {
        console.error('Error deleting user:', error)
        res.status(500).json({ message: 'Error deleting user' })
        
    }
}