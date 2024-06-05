import { Router } from "express";
import * as commentController from '../controllers/comments.controller';

const commentRouter = Router();

commentRouter.get('/', commentController.index);

export default commentRouter;