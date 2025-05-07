import Advert from '../models/Advert.js';
import { sanitizeAdvert } from '../utils/sanitizaAdvert.js';

export const getUserAdverts = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = { owner: username };
    const totalCount = await Advert.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;

    const adverts = await Advert.find(filter)
      .populate('ownerId', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const sanitized = adverts.map(ad => sanitizeAdvert(ad, req.user?._id));

    res.status(200).json({ results: sanitized, totalPages });
  } catch (error) {
    console.error('Error fetching user adverts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
