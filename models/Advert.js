import mongoose, { Schema } from 'mongoose';

const AdvertSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: String, required: true },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    price: { type: Number, required: true },
    image: String,
    tags: [{ type: String }],
    type: { type: String, enum: ['buy', 'sell'], required: true },
    reserved: { type: Boolean, default: false },
    sold: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Advert = mongoose.model('Advert', AdvertSchema);
export default Advert;
