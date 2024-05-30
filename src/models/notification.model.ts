import mongoose, { Schema, Document, Model } from 'mongoose';

interface NotificationDocument extends Document {
    electionId: string;
    userId: string;
    text: string;
    active: boolean;
}

const notificationSchema: Schema<NotificationDocument> = new Schema({
    electionId: { type: String, required: true },
    userId: { type: String, required: true },
    text: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
}, { timestamps: true });

const NotificationModel: Model<NotificationDocument> = mongoose.model('Notification', notificationSchema);

class Notification {
    id: string;
    electionId: string;
    userId: string;
    text: string;
    active: boolean;

    constructor({ id, electionId, userId, text, active }: Partial<NotificationDocument>) {
        this.id = id || '';
        this.electionId = electionId || '';
        this.userId = userId || '';
        this.text = text || '';
        this.active = active || true;
    }

    static async findAll(limit: number, offset: number): Promise<NotificationDocument[]> {
        const notification = await NotificationModel.find()
            .skip(offset)
            .limit(limit)
            .exec();
        return notification;
    }

    static async findAllActive(limit: number, offset: number): Promise<NotificationDocument[]> {
        const notification = await NotificationModel.find({ active: true })
            .skip(offset)
            .limit(limit)
            .exec();
        return notification;
    }

    static async findById(id: string): Promise<NotificationDocument | null> {
        const notification = await NotificationModel.findById(id).exec();
        return notification;
    }

    static async findByUserId(userId: string): Promise<NotificationDocument[]> {
        const notification = await NotificationModel.find({ userId }).exec();
        return notification;
    }

    async create(): Promise<NotificationDocument> {
        const notification = new NotificationModel({
            electionId: this.electionId,
            userId: this.userId,
            text: this.text,
            active: this.active
        });
        const savedNotification = await notification.save();
        this.id = (savedNotification._id as string).toString(); // Convertir ObjectId a string
        return savedNotification;
    }

    static async closeNotification(id: string): Promise<NotificationDocument | null> {
        const updatedNotification = await NotificationModel.findByIdAndUpdate(id, { active: true }, { new: false }).exec();
        return updatedNotification;
    }
}

export default Notification;