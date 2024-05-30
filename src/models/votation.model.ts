import mongoose, { Schema, Document, Model } from 'mongoose';

interface VotationDocument extends Document {
    userId: string;
    electionId: string;
    optionSelected: number;
}

const votationSchema: Schema<VotationDocument> = new Schema({
    userId: { type: String, required: true },
    electionId: { type: String, required: true },
    optionSelected: { type: Number, required: true },
}, { timestamps: true });

const VotationModel: Model<VotationDocument> = mongoose.model('Votation', votationSchema);

class Votation {
    id: string;
    userId: string;
    electionId: string;
    optionSelected: number;

    constructor({ id, userId, electionId, optionSelected }: Partial<VotationDocument>) {
        this.id = id || '';
        this.userId = userId || '';
        this.electionId = electionId || '';
        this.optionSelected = optionSelected || 0;
    }

    static async findAll(limit: number, offset: number): Promise<VotationDocument[]> {
        const votations = await VotationModel.find()
            .skip(offset)
            .limit(limit)
            .exec();
        return votations;
    }

    static async findById(id: string): Promise<VotationDocument | null> {
        const votation = await VotationModel.findById(id).exec();
        return votation;
    }

    static async findByUserId(userId: string): Promise<VotationDocument[]> {
        const votations = await VotationModel.find({ userId }).exec();
        return votations;
    }

    static async findByElectionId(electionId: string): Promise<VotationDocument[]> {
        const votations = await VotationModel.find({ electionId }).exec();
        return votations;
    }

    async create(): Promise<VotationDocument> {
        const votation = new VotationModel({
            userId: this.userId,
            electionId: this.electionId,
            optionSelected: this.optionSelected
        });
        const savedVotation = await votation.save();
        this.id = (savedVotation._id as string).toString(); // Convertir ObjectId a string
        return savedVotation;
    }
}

export default Votation;