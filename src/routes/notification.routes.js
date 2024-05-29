import { Router } from "express";
import * as notificationController from "../controllers/tenis.controller.js";
import { httpAuthMiddleware } from "../middlewares/http/auth.middleware.js";

const notificationsRouter = Router();

notificationsRouter.get('/', httpAuthMiddleware, notificationController.getById);
notificationsRouter.get('/', httpAuthMiddleware, notificationController.index);

export default notificationsRouter;