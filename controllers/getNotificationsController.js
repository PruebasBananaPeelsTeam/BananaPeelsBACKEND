import User from '../models/User.js';

/**
 * Obtener todas las notificaciones del usuario autenticado
 */
export const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
            .populate('notifications.advertId', 'name')
            .select('notifications')
            .lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const sortedNotifications = Array.isArray(user.notifications)
            ? user.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            : [];

        res.json({
            success: true,
            results: sortedNotifications,
        });
    } catch (err) {
        console.error('❌ Error fetching notifications:', err);
        next(err);
    }
};


/**
 * Marcar una notificación como leída
 */
export const markNotificationAsRead = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;

        const user = await User.findById(userId);

        const notification = user.notifications.id(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.read = true;
        await user.save();

        res.json({
            success: true,
            message: 'Notification marked as read',
        });
    } catch (err) {
        console.error('❌ Error marking notification as read:', err);
        next(err);
    }
};
