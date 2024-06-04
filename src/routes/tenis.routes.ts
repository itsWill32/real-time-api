import { Router } from "express";
import * as tenisController from "../controllers/tenis.controller"
import { httpAuthMiddleware } from "../middlewares/http/auth.middleware";

const tenisRouter = Router();

tenisRouter.post('/', httpAuthMiddleware, tenisController.createTenis);
tenisRouter.get('/:id', tenisController.getById);
tenisRouter.get('/', tenisController.index);

export default tenisRouter;