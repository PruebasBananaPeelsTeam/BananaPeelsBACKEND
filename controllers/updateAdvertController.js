import Advert from '../models/Advert.js';
import createError from 'http-errors';


export async function updateAdvert(req, res, next) {
  try {
    const advertId = req.params.id;
    const userId = req.user._id;

    const advert = await Advert.findById(advertId);

    
    if (!advert) {
      console.warn(`WARNING - Usuario ${userId} intentó editar un anuncio inexistente.`);
      return next(createError(404, 'Advert not found'));
    }

    // Validar que el anuncio pertenece al usuario logado
    if (advert.ownerId.toString() !== userId.toString()) {
      console.warn(`WARNING - Usuario ${userId} no autorizado para editar el anuncio ${advertId}.`);
      return next(createError(403, 'Not authorized'));
    }

    // Actualizar los campos permitidos
    const { name, description, price, tags, type } = req.body;

    advert.name = name || advert.name;
    advert.description = description || advert.description;
    advert.price = price || advert.price;
    advert.tags = tags || advert.tags;
    advert.type = type || advert.type;

    // Nueva imagen
    if (req.file) {
      advert.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    const updatedAdvert = await advert.save();

    res.status(200).json({ success: true, result: updatedAdvert });
  } catch (err) {
    console.error('❌ Error al editar el anuncio:', err);
    next(err);
  }
}
