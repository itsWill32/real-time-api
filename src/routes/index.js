import { Router } from 'express';
import electionsRouter from './elections.routes.js';
import notificationsRouter from './notification.routes.js';
import tenisRouter from './tenis.routes.js';
import usersRouter from './users.routes.js';
import authRouter from './auth.routes.js';

export const router = Router();
router.use('/auth', authRouter);
router.use('/elections', electionsRouter);
router.use('/notifications', notificationsRouter);
router.use('/tenis', tenisRouter);
router.use('/users', usersRouter);
