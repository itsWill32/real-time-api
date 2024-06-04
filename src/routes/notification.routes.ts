import { Router } from "express";
import * as notificationController from "../controllers/notifications.controller"
import { httpAuthMiddleware } from "../middlewares/http/auth.middleware";

const notificationsRouter = Router();

// notificationsRouter.get('/object/:id', httpAuthMiddleware, notificationController.getById);
notificationsRouter.get('/', httpAuthMiddleware, notificationController.index);
notificationsRouter.get('/users', httpAuthMiddleware, notificationController.getNotificationsByUser);

export default notificationsRouter;