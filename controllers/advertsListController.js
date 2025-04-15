import Advert from '../models/Advert.js';

//Listing logic

export async function advertsList(req, res, next) {
    try {
        //Filters:
        const filterName = req.query.name
            ? new RegExp(req.query.name, 'i')
            : null;
        const filterPrice = req.query.price || null;
        //Pagination
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;

        // Calculamos el 'skip' basado en la página
        const skip = (page - 1) * limit;

        //Sorting:
        const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1; //Si sortDirection es 'ascendente' será 1, si no, -1 (por defecto descendente)
        //Fields of our choice:
        const fields = req.query.fields ? req.query.fields.split(',') : null;

        const filter = {};

        if (filterName) {
            filter.name = filterName;
        }

        if (filterPrice) {
            filter.price = filterPrice;
        }

        //Performing the query with filters, pagination, and sorting:

        const adverts = await Advert.find(filter)
            .select(fields)
            .sort({ createdAt: sortDirection })
            .skip(skip)
            .limit(limit)
            .exec();

        // Get total number of ads to calculate total pages
        const totalAds = await Advert.countDocuments(filter); // Cuenta el total de anuncios con los filtros aplicados
        const totalPages = Math.ceil(totalAds / limit); // Calcula el número total de páginas

        res.json({ success: true, results: adverts, totalPages: totalPages, currentPage: page });
    } catch (err) {
        next(err);
    }
}
