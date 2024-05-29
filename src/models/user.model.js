import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

const UserModel = model('User', userSchema);

class User {
    constructor({ id, username, email, password }) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static async findAll(limit, offset) {
        const users = await UserModel.find()
            .skip(offset)
            .limit(limit)
            .exec();
        return users;
    }

    static async getById(id) {
        const user = await UserModel.findById(id).exec();
        return user;
    }

    static async getByEmail(email) {
        const user = await UserModel.findOne({ email }).exec();
        return user;
    }

    async create() {
        const user = new UserModel({
            username: this.username,
            email: this.email,
            password: this.password
        });
        const savedUser = await user.save();
        this.id = savedUser._id;
        return savedUser;
    }
}

export default User;