import Advert from '../models/Advert.js';

// Controlador para crear un nuevo anuncio
export const createAdvert = async (req, res, next) => {
    try {
        const { name, description, price, tags, type } = req.body;

        const advert = new Advert({
            name,
            description,
            price,
            tags,
            type,
            image: req.file
                ? req.file.buffer.toString('base64')
                : null,
            owner: req.user.username,
            ownerId: req.user._id,
        });

        const savedAdvert = await advert.save();
        res.status(201).json(savedAdvert);
    } catch (err) {
        console.error('❌ Error al crear el anuncio:', err);
        res.status(500).json({ error: err.message });
        next(err);
    }
};
