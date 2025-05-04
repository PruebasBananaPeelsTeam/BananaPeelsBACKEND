import User from "../models/User.js";

/**
 * añade una notificación al usuario que tiene marcado el anuncio como favorito
 * @param {string} advertId - id del anuncio
 * @param {string} message - mensaje de la notificación
 */

export async function notifyFavorites(advertId, message) {
    try {
        const users = await User.find({ favorites: advertId})
        for (const user of users) {
            user.notifications.push({
                advertId,
                message,
                read: false,
                createdAt: new Date(),
            })
            await user.save()
        }
    } catch (err) {
        console.error('add notification error:', err.message)
        
    }
}