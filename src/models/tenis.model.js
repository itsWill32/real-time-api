import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Definimos el esquema de tenis
const tenisSchema = new Schema({
    img: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
}, { timestamps: true });

// Creamos el modelo de tenis a partir del esquema
const TenisModel = model('Tenis', tenisSchema);

class Tenis {
    constructor({ id, name, brand, img }) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.img = img;
    }

    static async findAll(limit, offset) {
        const tenis = await TenisModel.find()
            .skip(offset)
            .limit(limit)
            .exec();
        return tenis;
    }

    static async findById(id) {
        const tenis = await TenisModel.findById(id).exec();
        return tenis;
    }

    async create() {
        const tenis = new TenisModel({
            name: this.name,
            brand: this.brand,
            img: this.img
        });
        const savedTenis = await tenis.save();
        this.id = savedTenis._id;
        return savedTenis;
    }
}

export default Tenis;