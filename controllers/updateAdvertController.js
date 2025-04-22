import Advert from '../models/Advert.js';

export async function updateAdvert(req, res, next) {
    try {
        const advertId = req.params.id;
        const userId = req.user._id;

        const advert = await Advert.findById(advertId);

        if (!advert) {
            return res.status(404).json({ error: 'Advert not found' });
        }

        if (advert.ownerId.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'You are not authorized to edit this advert' });
        }

        
        const updatedFields = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.file?.filename || advert.image, 
            tags: req.body.tags,
            type: req.body.type,
            reserved: req.body.reserved,
            sold: req.body.sold,
        };

        Object.assign(advert, updatedFields);

        await advert.save();

        res.json({ success: true, advert });
    } catch (err) {
        next(err);
    }
}