import Advert from '../models/Advert.js';
import { notifyFavorites } from '../lib/createNotifications.js';

export async function updateAdvert(req, res, next) {
    try {
        const advertId = req.params.id;
        const userId = req.user._id;

        const advert = await Advert.findById(advertId);

        if (!advert) {
            return res
                .status(404)
                .json({ success: false, message: 'Advert not found' });
        }

        if (advert.ownerId.toString() !== userId.toString()) {
            return res
                .status(403)
                .json({ error: 'You are not authorized to edit this advert' });
        }
        const originalPrice = advert.price

        const updatedFields = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            //Si req.file existe(hay una nueva imagen), convertir a base64 y usarlo. Si no, mantener la imagen anterior (advert.image)
            image: req.file ? req.file.buffer.toString('base64') : advert.image, 
            tags: req.body.tags,
            type: req.body.type,
            reserved: req.body.reserved,
            sold: req.body.sold,
        };

        Object.assign(advert, updatedFields);

        await advert.save();

        if (originalPrice !== advert.price) {
            const message = `The price of an advert you favorited has changed from ${originalPrice} to ${advert.price}`;
            await notifyFavorites(advert._id, message);
        }

        res.json({ success: true, advert });
    } catch (err) {
        next(err);
    }
}
