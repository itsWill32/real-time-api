import { Router } from "express";
import * as usersController from "../controllers/users.controller";
import { httpAuthMiddleware } from "../middlewares/http/auth.middleware"; 

const usersRouter = Router();

usersRouter.get('/', httpAuthMiddleware, usersController.index);
usersRouter.get('/:id', httpAuthMiddleware, usersController.show);
usersRouter.post('/', usersController.createUser);

export default usersRouter;