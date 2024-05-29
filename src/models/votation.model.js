import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Definimos el esquema de votation
const votationSchema = new Schema({
    userId: { type: String, required: true },
    electionId: { type: String, required: true },
    optionSelected: { type: Number, required: true },
}, { timestamps: true });

// Creamos el modelo de votation a partir del esquema
const VotationModel = model('Votation', votationSchema);

class Votation {
    constructor({ id, userId, electionId, optionSelected }) {
        this.id = id;
        this.userId = userId;
        this.electionId = electionId;
        this.optionSelected = optionSelected;
    }

    static async findAll(limit, offset) {
        const votations = await VotationModel.find()
            .skip(offset)
            .limit(limit)
            .exec();
        return votations;
    }

    static async findById(id) {
        const votation = await VotationModel.findById(id).exec();
        return votation;
    }

    static async findByUserId(userId) {
        // const votation = await VotationModel.findOne({ userId }).exec();
        const votation = await VotationModel.find({ userId }).exec();
        return votation;
    }

    static async findByElectionId(electionId) {
        const votations = await VotationModel.find({ electionId }).exec();
        return votations;
    }

    async create() {
        const votation = new VotationModel({
            userId: this.userId,
            electionId: this.electionId,
            optionSelected: this.optionSelected
        });
        const savedVotation = await votation.save();
        this.id = savedVotation._id;
        return savedVotation;
    }
}

export default Votation;