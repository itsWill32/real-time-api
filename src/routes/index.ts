import { Router } from 'express';
import electionsRouter from './elections.routes';
import notificationsRouter from './notification.routes';
import tenisRouter from './tenis.routes';
import usersRouter from './users.routes';
import authRouter from './auth.routes';
import commentRouter from './comments.routes';

export const router = Router();
router.use('/auth', authRouter);
router.use('/elections', electionsRouter);
router.use('/notifications', notificationsRouter);
router.use('/tenis', tenisRouter);
router.use('/users', usersRouter);
router.use('/comments', commentRouter);