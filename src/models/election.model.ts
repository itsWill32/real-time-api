import mongoose, { Schema, Document, Model } from 'mongoose';

interface ElectionDocument extends Document {
    optionOneId: string;
    optionTwoId: string;
    expiration: Date;
    optionOneVotes: number;
    optionTwoVotes: number;
    expired: boolean;
}

const electionSchema: Schema<ElectionDocument> = new Schema({
    optionOneId: { type: String, required: true },
    optionTwoId: { type: String, required: true },
    expiration: { type: Date, required: true },
    optionOneVotes: { type: Number, default: 0 },
    optionTwoVotes: { type: Number, default: 0 },
    expired: { type: Boolean, default: false },
}, { timestamps: true });

const ElectionModel: Model<ElectionDocument> = mongoose.model('Election', electionSchema);

class Election {
    id: string;
    optionOneId: string;
    optionTwoId: string;
    expiration: Date;
    optionOneVotes: number;
    optionTwoVotes: number;

    constructor({ id, optionOneId, optionTwoId, expiration, optionOneVotes, optionTwoVotes }: Partial<ElectionDocument>) {
        this.id = id || '';
        this.optionOneId = optionOneId || '';
        this.optionTwoId = optionTwoId || '';
        this.expiration = expiration || new Date();
        this.optionOneVotes = optionOneVotes || 0;
        this.optionTwoVotes = optionTwoVotes || 0;
    }

    static async findAll(limit: number, offset: number): Promise<ElectionDocument[]> {
        if (limit === 0 && offset === 0) {
            const elections = await ElectionModel.find({ expired: false }).exec();
            return elections;
        } else {
            const elections = await ElectionModel.find({ expired: false })
                .skip(offset)
                .limit(limit)
                .exec();
            return elections;
        }
    }

    static async findById(id: string): Promise<ElectionDocument | null> {
        const election = await ElectionModel.findById(id).exec();
        return election;
    }

    async create(): Promise<ElectionDocument> {
        const election = new ElectionModel({
            optionOneId: this.optionOneId,
            optionTwoId: this.optionTwoId,
            expiration: this.expiration,
            optionOneVotes: this.optionOneVotes,
            optionTwoVotes: this.optionTwoVotes
        });
        const savedElection = await election.save();
        this.id = (savedElection._id as string).toString(); // Convertir ObjectId a string
        return savedElection;
    }

    static async update(id: string, electionData: Partial<ElectionDocument>): Promise<ElectionDocument | null> {
        const updatedElection = await ElectionModel.findByIdAndUpdate(id, electionData, { new: true }).exec();
        return updatedElection;
    }

    static async delete(id: string): Promise<ElectionDocument | null> {
        const deletedElection = await ElectionModel.findByIdAndDelete(id).exec();
        return deletedElection;
    }

    static async vote(option: string, id: string): Promise<ElectionDocument | null> {
        let update: any;
        if (option === "optionOne") {
            update = { $inc: { optionOneVotes: 1 } };
        } else if (option === "optionTwo") {
            update = { $inc: { optionTwoVotes: 1 } };
        }

        const vote = await Election.findById(id);
        console.log(vote);

        const voteResult = await ElectionModel.findByIdAndUpdate(id, update, { new: true }).exec();
        console.log(voteResult);
        return voteResult;
    }

    static async expire(id: string): Promise<ElectionDocument | null> {
        const expiredElection = await ElectionModel.findByIdAndUpdate(id, { expired: true }, { new: true }).exec();
        return expiredElection;
    }
}

export default Election;