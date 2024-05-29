import Notification from "../models/notification.model.js";

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
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
            error: error.message
        });
    }
}

const closeNotification = async (req, res) => {
    try {
        const id = req.params.notificationId;
        const notification = await Notification.closeNotification(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "no se encontró la notificación"
            });
        }

        return res.status(200).json({
            success: true,
            notification,
            message: "se cerró la notificación correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al cerrar la notificación",
            error: error.message
        });
    }
}

export {
    index,
    closeNotification
}