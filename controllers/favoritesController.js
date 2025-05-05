import User from '../models/User.js';
import Advert from '../models/Advert.js';

// GET /favorites

export const getFavorites = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;

    // Obtener IDs de favoritos del usuario
    const favorites = user.favorites || [];
    const total = favorites.length;
    const totalPages = Math.ceil(total / limit); // Calcular total de páginas

    // Obtener solo los IDs que corresponden a esta página
    const paginatedIds = favorites.slice(skip, skip + limit);

    // Buscar los anuncios en base a los IDs paginados y ordenarlos por fecha
    const paginatedFavorites = await Advert.find({
      _id: { $in: paginatedIds },
    }).sort({ createdAt: sortDirection });

    res.json({
      success: true,
      results: paginatedFavorites,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    // Manejo de errores
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Error fetching favorites' });
  }
};


// POST /favorites/:advertId 
export const addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { advertId } = req.params;

     // Autorización
     if (!user) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // ✅ Verificar que el anuncio existe
    const advertExists = await Advert.findById(advertId);
    if (!advertExists) {
      return res.status(404).json({ error: 'Advert not found' });
    }

    // Añadir a favoritos si aún no está
    if (!user.favorites.includes(advertId)) {
      user.favorites.push(advertId);
      await user.save();
    }

    res.json({ message: 'Advert added to favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Error adding favorite' });
  }
};


// DELETE /favorites/:advertId 
export const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { advertId } = req.params;

    // Autorización
    if (!user) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== advertId
    );

    await user.save();
    res.json({ message: 'Advert removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Error removing favorite' });
  }
};
