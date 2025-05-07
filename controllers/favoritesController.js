import User from '../models/User.js';
import Advert from '../models/Advert.js';
import { sanitizeAdvert } from '../utils/sanitizaAdvert.js';

// GET /favorites
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;

    const favorites = user.favorites || [];
    const total = favorites.length;
    const totalPages = Math.ceil(total / limit);

    const paginatedIds = favorites.slice(skip, skip + limit);

    const paginatedFavorites = await Advert.find({
      _id: { $in: paginatedIds },
    }).populate('ownerId', '_id username')
      .sort({ createdAt: sortDirection });

    // ✅ Sanitizar antes de enviar
    const sanitizedFavorites = paginatedFavorites.map(ad =>
      sanitizeAdvert(ad, req.user._id)
    );

    res.json({
      success: true,
      results: sanitizedFavorites,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Error fetching favorites' });
  }
};

// POST /favorites/:advertId 
export const addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { advertId } = req.params;

    if (!user) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const advertExists = await Advert.findById(advertId);
    if (!advertExists) {
      return res.status(404).json({ error: 'Advert not found' });
    }

    if (!user.favorites.includes(advertId)) {
      user.favorites.push(advertId);
      await user.save();
    }

    res.json({ message: 'Advert added to favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Error adding favorite' });
  }
};

// DELETE /favorites/:advertId 
export const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { advertId } = req.params;

    if (!user) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== advertId
    );

    await user.save();
    res.json({ message: 'Advert removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Error removing favorite' });
  }
};
