import Advert from '../models/Advert.js';
import createError from 'http-errors';

export async function toggleReservedAdvert(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const advert = await Advert.findById(id);
        if (!advert) {
            return next(createError(404, 'Advert not found'));
        }
        // Verify the user logged is the owner
        if (!advert.ownerId.equals(userId)) {
            return next(createError(403, 'Unauthorized action'));
        }
        // turn the reserve state and save
        advert.reserved = !advert.reserved;
        await advert.save();

        res.status(200).json({
            success: true,
            message: `Advert ${advert.reserved ? 'marked as reserved' : 'unmarked as reserved'}`,
            reserved: advert.reserved,
        });
    } catch (error) {
        console.error('❌ Error toggling reserved state:', error.message);
        return next(createError(500, 'Internal server error'));
    }
}

export async function toggleSoldAdvert(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const advert = await Advert.findById(id);
        if (!advert) {
            return next(createError(404, 'Advert not found'));
        }

        if (!advert.ownerId.equals(userId)) {
            return next(createError(403, 'Unauthorized action'));
        }

        advert.sold = !advert.sold;
        await advert.save();

        res.status(200).json({
            success: true,
            message: `Advert ${advert.sold ? 'marked as sold' : 'unmarked as sold'}`,
            sold: advert.sold,
        });
    } catch (error) {
        console.error('❌ Error toggling sold state:', error.message);
        return next(createError(500, 'Internal server error'));
    }
}
