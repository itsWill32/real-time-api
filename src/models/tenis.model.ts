import mongoose, { Schema, Document, Model } from 'mongoose';

interface TenisDocument extends Document {
    name: string;
    brand: string;
    img: string;
}

const tenisSchema: Schema<TenisDocument> = new Schema({
    img: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
}, { timestamps: true });

const TenisModel: Model<TenisDocument> = mongoose.model('Tenis', tenisSchema);

class Tenis {
    id: string;
    name: string;
    brand: string;
    img: string;

    constructor({ id, name, brand, img }: Partial<TenisDocument>) {
        this.id = id || '';
        this.name = name || '';
        this.brand = brand || '';
        this.img = img || '';
    }

    static async findAll(limit: number, offset: number): Promise<TenisDocument[]> {
        const tenis = await TenisModel.find()
            .skip(offset)
            .limit(limit)
            .exec();
        return tenis;
    }

    static async findById(id: string): Promise<TenisDocument | null> {
        const tenis = await TenisModel.findById(id).exec();
        return tenis;
    }

    async create(): Promise<TenisDocument> {
        const tenis = new TenisModel({
            name: this.name,
            brand: this.brand,
            img: this.img
        });
        const savedTenis = await tenis.save();
        this.id = (savedTenis._id as string).toString(); // Convertir ObjectId a string
        return savedTenis;
    }
}

export default Tenis;