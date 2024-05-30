import { Router } from "express";
import * as tenisController from "../controllers/tenis.controller"
import { httpAuthMiddleware } from "../middlewares/http/auth.middleware";

const tenisRouter = Router();

tenisRouter.post('/', httpAuthMiddleware, tenisController.createTenis);
tenisRouter.get('/', httpAuthMiddleware, tenisController.getById);
tenisRouter.get('/', httpAuthMiddleware, tenisController.index);

export default tenisRouter;