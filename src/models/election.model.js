import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Definimos el esquema de Election
const electionSchema = new Schema({
    optionOneId: { type: String, required: true },
    optionTwoId: { type: String, required: true },
    expiration: { type: Date, required: true },
    optionOneVotes: { type: Number, default: 0 },
    optionTwoVotes: { type: Number, default: 0 },
    expired: { type: Boolean, default: false },
}, { timestamps: true });

// Creamos el modelo de Election a partir del esquema
const ElectionModel = model('Election', electionSchema);

class Election {
    constructor({ id, optionOneId, optionTwoId, expiration, optionOneVotes, optionTwoVotes }) {
        this.id = id;
        this.optionOneId = optionOneId;
        this.optionTwoId = optionTwoId;
        this.expiration = expiration;
        this.optionOneVotes = optionOneVotes;
        this.optionTwoVotes = optionTwoVotes;
    }

    static async findAll(limit, offset) {
        const elections = await ElectionModel.find()
            .skip(offset)
            .limit(limit)
            .exec();
        return elections;
    }

    static async findById(id) {
        const election = await ElectionModel.findById(id).exec();
        return election;
    }

    async create() {
        const election = new ElectionModel({
            optionOneId: this.optionOneId,
            optionTwoId: this.optionTwoId,
            expiration: this.expiration,
            optionOneVotes: this.optionOneVotes,
            optionTwoVotes: this.optionTwoVotes
        });
        const savedElection = await election.save();
        this.id = savedElection._id;
        return savedElection;
    }

    static async update(id, electionData) {
        const updatedElection = await ElectionModel.findByIdAndUpdate(id, electionData, { new: true }).exec();
        return updatedElection;
    }

    static async delete(id) {
        const deletedElection = await ElectionModel.findByIdAndDelete(id).exec();
        return deletedElection;
    }

    static async vote(option, id) {
        let update;
        if (option === "optionOne") {
            update = { $inc: { optionOneVotes: 1 } };
        } else if (option === "optionTwo") {
            update = { $inc: { optionTwoVotes: 1 } };
        }
        const voteResult = await ElectionModel.findByIdAndUpdate(id, update, { new: true }).exec();
        return voteResult;
    }

    static async expire(id) {
        const expiredElection = await ElectionModel.findByIdAndUpdate(id, { expired: true }, { new: true }).exec();
        return expiredElection;
    }
}

export default Election;