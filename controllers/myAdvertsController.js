import Advert from '../models/Advert.js';

export async function myAdverts(req, res, next) {
    try {
      const userId = req.user._id;
  
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;
  
      const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;
  
      const adverts = await Advert.find({ ownerId: userId })
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec();
  
      const totalAds = await Advert.countDocuments({ ownerId: userId });
      const totalPages = Math.ceil(totalAds / limit);
  
      res.json({
        success: true,
        results: adverts,
        totalPages,
        currentPage: page,
      });
    } catch (err) {
      next(err);
    }
  }
  
