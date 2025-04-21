import Advert from '../models/Advert.js';


export async function myAdverts(req, res, next) {
    try {
        const userId = req.user._id; 

        const adverts = await Advert.find({ ownerId: userId }).exec();

        res.json({ success: true, results: adverts });
    } catch (err) {
        next(err);
    }
}
