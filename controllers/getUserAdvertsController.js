import Advert from "../models/Advert.js";

export const getUserAdverts = async (req, res) => {
    try {
        const { username } = req.params
        const adverts = await Advert.find({ owner: username}).sort({createdAt: -1}).limit(50)
        res.status(200).json(adverts)
    } catch (error) {
        console.error("Error fetching user adverts:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}