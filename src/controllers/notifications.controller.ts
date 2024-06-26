import { Request, Response } from 'express';
import Notification from '../models/notification.model';

interface CustomRequest extends Request {
    user?: any;
}

export const index = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        const offset = (page - 1) * limit;

        const notifications = await Notification.findAllActive(limit, offset);

        return res.status(200).json({
            success: true,
            notifications,
            message: "se obtuvieron las notificaciones correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al obtener las notificaciones",
            error: (error as Error).message
        });
    }
}

export const getNotificationsByUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).user.id;
        console.log("userId notifications", userId);
        const notifications = await Notification.findByUserId(userId);

        return res.status(200).json({
            success: true,
            notifications,
            message: "se obtuvieron las notificaciones correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al obtener las notificaciones",
            error: (error as Error).message
        });
    }
}

export const closeNotification = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.notificationId;
        const userId = (req as CustomRequest).user.id;
        const notification = await Notification.closeNotification(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "no se encontró la notificación"
            });
        }

        const notifications = await Notification.findByUserId(userId);

        return res.status(200).json({
            success: true,
            notification,
            notifications,
            message: "se cerró la notificación correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al cerrar la notificación",
            error: (error as Error).message
        });
    }
}