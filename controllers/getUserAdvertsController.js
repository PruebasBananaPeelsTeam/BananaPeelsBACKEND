import Advert from '../models/Advert.js';

export const getUserAdverts = async (req, res) => {
    try {
        const { username } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filter = { owner: username };
        const totalCount = await Advert.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limit);
        const skip = (page - 1) * limit;
        const adverts = await Advert.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({ results: adverts, totalPages });
    } catch (error) {
        console.error('Error fetching user adverts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
