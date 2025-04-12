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
                ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                : null,
            owner: req.user.username,
        });

        const savedAdvert = await advert.save();
        res.status(201).json(savedAdvert);
    } catch (err) {
        console.error('❌ Error al crear el anuncio:', err);
        res.status(500).json({ error: err.message });
        next(err);
    }
};
