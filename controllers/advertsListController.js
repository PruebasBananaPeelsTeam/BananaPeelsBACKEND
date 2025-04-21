import Advert from '../models/Advert.js';

// Listing and Search Logic
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
            filter.tags = req.query.tag;
        }

        // Pagination
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        // Sorting
        const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;

        const fields = req.query.fields ? req.query.fields.split(',') : null;

        const adverts = await Advert.find(filter)
            .select(fields)
            .sort({ createdAt: sortDirection })
            .skip(skip)
            .limit(limit)
            .exec();

        // Get total number of ads to calculate total pages

        const totalAds = await Advert.countDocuments(filter);
        const totalPages = Math.ceil(totalAds / limit);

        res.json({
            success: true,
            results: adverts,
            totalPages: totalPages,
            currentPage: page,
        });
    } catch (err) {
        next(err);
    }
}
