import { Router } from "express";
import * as notificationController from "../controllers/tenis.controller";
import { httpAuthMiddleware } from "../middlewares/http/auth.middleware";

const notificationsRouter = Router();

notificationsRouter.get('/', httpAuthMiddleware, notificationController.getById);
notificationsRouter.get('/', httpAuthMiddleware, notificationController.index);

export default notificationsRouter;