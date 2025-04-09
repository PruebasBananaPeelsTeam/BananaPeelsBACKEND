import Advert from '../models/Advert.js';

// Controlador para crear un nuevo anuncio
export const createAdvert = async (req, res, next) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ error: 'Se requiere una imagen válida' });
        }

        const { name, description, price, tags, type } = req.body;

        const advert = new Advert({
            name,
            description,
            price,
            tags,
            type,
            image: req.file.filename,
            //owner: req.user._id, // Descomentar cuando se implemente la autenticación
            owner: '660e04e23fc0545e42c0de9e', // temporal
        });

        const savedAdvert = await advert.save();
        res.status(201).json(savedAdvert);
    } catch (err) {
        next(err);
    }
};
