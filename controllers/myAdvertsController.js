import Advert from '../models/Advert.js';
import { sanitizeAdvert } from '../utils/sanitizaAdvert.js';

export async function myAdverts(req, res, next) {
  try {
    const userId = req.user._id;

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;

    const adverts = await Advert.find({ ownerId: userId })
      .populate('ownerId', '_id username') // necesario para sanitize
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalAds = await Advert.countDocuments({ ownerId: userId });
    const totalPages = Math.ceil(totalAds / limit);

    // ✅ Aplicar sanitización a cada anuncio
    const sanitizedAdverts = adverts.map(ad => sanitizeAdvert(ad, userId));

    res.json({
      success: true,
      results: sanitizedAdverts,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
}
