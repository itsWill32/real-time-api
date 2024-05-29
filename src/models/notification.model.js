import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Definimos el esquema de notification
const notificationSchema = new Schema({
    electionId: { type: String, required: true },
    userId: { type: String, required: true },
    text: { type: String, required: true },
    active: { type: Boolean, required: true, default: true},
}, { timestamps: true });

// Creamos el modelo de notification a partir del esquema
const NotificationModel = model('Notification', notificationSchema);

class Notification {
    constructor({ id, electionId, userId, text, active }) {
        this.id = id;
        this.electionId = electionId;
        this.userId = userId;
        this.text = text;
        this.active = active;
    }

    static async findAll(limit, offset) {
        const notification = await NotificationModel.find()
            .skip(offset)
            .limit(limit)
            .exec();
        return notification;
    }

    static async findAllActive(limit, offset) {
        const notification = await NotificationModel.find({ active: true })
            .skip(offset)
            .limit(limit)
            .exec();
        return notification;
    }

    static async findById(id) {
        const notification = await NotificationModel.findById(id).exec();
        return notification;
    }

    static async findByUserId(userId) {
        // const notification = await notificationModel.findOne({ userId }).exec();
        const notification = await NotificationModel.find({ userId }).exec();
        return notification;
    }

    async create() {
        const notification = new NotificationModel({
            electionId: this.electionId,
            userId: this.userId,
            text: this.text,
            active: this.active
        });
        const savedNotification = await notification.save();
        this.id = savedNotification._id;
        return savedNotification;
    }

    static async closeNotification(id) {
        const updatedNotification = await NotificationModel.findByIdAndUpdate(id, { active: true }, { new: false }).exec();
        return updatedNotification;
    }
}

export default Notification;