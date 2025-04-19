import Advert from '../models/Advert.js';

export async function myAdverts(req, res, next) {
    try {
        const filter = {};
        filter.ownerId = req.body.id;
        const adverts = await Advert.find(filter).exec();

        res.json({ success: true, results: adverts });
    } catch (err) {
        next(err);
    }
}
