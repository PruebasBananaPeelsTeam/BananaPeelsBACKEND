import Advert from "../models/advertModel.js";

//Logica del listado

export async function advertsList(req, res, next) {
  try {
    //Filtros:
    const filterName = req.query.name ? new RegExp(req.query.name, 'i') : null; // Filtro por nombre (insensible a mayúsculas)
    const filterPrice = req.query.price || null; //Filtro por precio
    //Paginación
    const limit = parseInt(req.query.limit) || 10; //Por defecto 10 resultados por página
    const skip = parseInt(req.query.skip) || 0; //Por defecto no saltar resultados
    //Ordenación:
    const sortDirection = req.query.sortDirection === 'acs' ? 1 : -1; //Si sortDirection es 'ascendente' será 1, si no, -1 (por defecto descendente)
    //Campos que queramos:
    const fields = req.query.fields ? req.query.fields.split(',') : null; //Campos específicos a devolver

    const filter = {};

    if (filterName) {
      filter.name = filterName;
    }

    if (filterPrice) {
      filter.price = filterPrice;
    }

    //Realizando la consulta con filtros, paginación y ordenación:

    const adverts = await Advert.find(filter)
    .select(fields) //Seleccionamos los campos solicitados  
    .sort({ createdAt: sortDirection }) //Ordenamos según la dirección solicitada (asc o desc) ({ createdAt: -1 })
    .skip(skip) //Paginación -saltamos los primeros 'skip' elementos
    .limit(limit) //Paginación -limitamos a 'limit' elementos
    .exec(); //Pra asegurarnos que se ejecuta
    
    res.json({ success: true, results: adverts })
  } catch (err) {
    next(err)
  }
}