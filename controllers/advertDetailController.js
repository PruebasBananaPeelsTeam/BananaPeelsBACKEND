import Advert from '../models/Advert.js';
import User from '../models/User.js';

export async function getAdvertDetail(req, res, next) {
    try {
        const { id } = req.params;

        const advert = await Advert.findById(id).lean();

        if (!advert) {
            return res
                .status(404)
                .json({ success: false, message: 'Advert not found' });
        }

        // Owner
        const user = await User.findOne({ username: advert.owner })
            .select('username email')
            .lean();

        res.json({
            success: true,
            results: {
                _id: advert._id,
                id: advert._id,
                name: advert.name,
                image: advert.image,
                description: advert.description,
                type: advert.type,
                price: advert.price,
                tags: advert.tags,
                owner: user || advert.owner,
                createdAt: advert.createdAt,
            },
        });
    } catch (err) {
        next(err);
    }
}
