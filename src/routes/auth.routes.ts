import { Router } from "express";
import * as authController from '../controllers/auth.controller'

const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/signup', authController.signUp);

export default authRouter;