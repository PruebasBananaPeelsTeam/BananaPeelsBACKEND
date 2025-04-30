import Advert from '../models/Advert.js';

export async function deleteAdvert(req, res, next) {
    try {
        const advertId = req.params.id;
        const userId = req.user._id;

        //Buscar el anuncio por id en la base de datos
        const advert = await Advert.findById(advertId);

        //Si no existe el anuncio devolvemos un error 404 diciendo 'Advert not found', y detenemos la ejecución del servidor para esa petición
        if (!advert) {
            return res
                .status(404)
                .json({ success: false, message: 'Advert not found' });
        }

        //Verificar que el usuario es el dueño del anuncio que intenta borrar. Si no lo es, devolvemos un 403 Forbidden
        if (advert.ownerId.toString() !== userId.toString()) {
            return res
                .status(403)
                .json({
                    error: 'You are not authorized to delete this advert',
                });
        }

        //Eliminar el anuncio
        await advert.deleteOne();

        //Enviar la respuesta en formato JSON al frontend
        res.json({
            success: true,
            message: 'Advert deleted successfully',
        });
    } catch (err) {
        next(err);
    }
}
