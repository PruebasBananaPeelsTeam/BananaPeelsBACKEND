import Advert from '../models/Advert.js';

// Controlador para crear un nuevo anuncio
export const createAdvert = async (req, res, next) => {
  try {
    // Extraemos los datos del cuerpo de la petición (formulario)
    const { name, description, price, tags, type, image } = req.body;

    // Creamos una nueva instancia del modelo Advert con los datos recibidos
    const advert = new Advert({
      name,
      description,
      price,
      tags,
      type,
      image,
      owner: req.user._id, // El usuario autenticado será el dueño del anuncio
    });

    // Guardamos el anuncio en la base de datos
    const savedAdvert = await advert.save();

    // Devolvemos el anuncio creado con un código 201 (creado)
    res.status(201).json(savedAdvert);
  } catch (err) {
    // En caso de error, lo pasamos al middleware de manejo de errores
    next(err);
  }
};
