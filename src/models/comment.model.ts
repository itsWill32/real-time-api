import mongoose, { Schema, Document, Model } from 'mongoose';

interface CommentDocument extends Document {
    userId: string;
    text: string;
}

const commentSchema: Schema<CommentDocument> = new Schema({
    userId: { type: String, required: true },
    text: { type: String, required: true },
}, { timestamps: true });

const CommentModel: Model<CommentDocument> = mongoose.model('Comment', commentSchema);

class Comment {
    id: string;
    userId: string;
    text: string;

    constructor({ id, userId, text }: Partial<CommentDocument>) {
        this.id = id || '';
        this.userId = userId || '';
        this.text = text || '';
    }

    static async findAll(limit: number, offset: number): Promise<CommentDocument[]> {
        const comment = await CommentModel.find()
            .skip(offset)
            .limit(limit)
            .exec();
        return comment;
    }

    static async findById(id: string): Promise<CommentDocument | null> {
        const comment = await CommentModel.findById(id).exec();
        return comment;
    }

    async create(): Promise<CommentDocument> {
        const comment = new CommentModel({
            userId: this.userId,
            text: this.text,
        });
        const savedComment = await comment.save();
        this.id = (savedComment._id as string).toString(); // Convertir ObjectId a string
        return savedComment;
    }
}

export default Comment;