import Advert from '../models/Advert.js';

export async function advertsList(req, res, next) {
  try {
    const filter = {};

    if (req.query.name) {
      filter.name = new RegExp(req.query.name, 'i');
    }

    const priceMin = req.query.priceMin;
    const priceMax = req.query.priceMax;

        if (priceMin !== undefined && priceMax !== undefined) {
            filter.price = {
                $gte: parseFloat(priceMin),
                $lte: parseFloat(priceMax),
            };
        } else if (priceMin !== undefined) {
            filter.price = { $gte: parseFloat(priceMin) };
        } else if (priceMax !== undefined) {
            filter.price = { $lte: parseFloat(priceMax) };
        }

    if (req.query.tag) {
      let tags = req.query.tag;
      filter.tags = { $in: tags }; // ✅ buscará los anuncios que contengan al menos uno de esos tags
    }


    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;

    const fields = req.query.fields ? req.query.fields.split(',') : null;

    
    const adverts = await Advert.find(filter)
      .select(fields)
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(limit)
      .exec();


    const totalAds = await Advert.countDocuments(filter);
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
