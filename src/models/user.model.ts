import mongoose, { Schema, Document, Model } from 'mongoose';

interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
}

const userSchema: Schema<UserDocument> = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

const UserModel: Model<UserDocument> = mongoose.model('User', userSchema);

class User {
    id: string;
    username: string;
    email: string;
    password: string;

    constructor({ id, username, email, password }: Partial<UserDocument>) {
        this.id = id || '';
        this.username = username || '';
        this.email = email || '';
        this.password = password || '';
    }

    static async findAll(limit: number, offset: number): Promise<UserDocument[]> {
        const users = await UserModel.find()
            .skip(offset)
            .limit(limit)
            .exec();
        return users;
    }

    static async getById(id: string): Promise<UserDocument | null> {
        const user = await UserModel.findById(id).exec();
        return user;
    }

    static async getByEmail(email: string): Promise<UserDocument | null> {
        const user = await UserModel.findOne({ email }).exec();
        return user;
    }

    async create(): Promise<UserDocument> {
        const user = new UserModel({
            username: this.username,
            email: this.email,
            password: this.password
        });
        const savedUser = await user.save();
        this.id = (savedUser._id as string).toString(); // Convertir ObjectId a string
        return savedUser;
    }
}

export default User;
