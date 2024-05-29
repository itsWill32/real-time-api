import { Router } from "express";
import * as electionsController from "../controllers/elections.controller.js";
import { httpAuthMiddleware } from "../middlewares/http/auth.middleware.js";

const electionsRouter = Router();

electionsRouter.get('/', httpAuthMiddleware, electionsController.index);
electionsRouter.get('/:id', httpAuthMiddleware, electionsController.show);
electionsRouter.post('/', httpAuthMiddleware, electionsController.createElection);
electionsRouter.patch('/:id', httpAuthMiddleware, electionsController.updateElection);
electionsRouter.delete('/:id', httpAuthMiddleware, electionsController.deleteElection);
electionsRouter.get('/new/permissions/users/', httpAuthMiddleware, electionsController.refreshElectionsByUser);
electionsRouter.post('/vote/:election', httpAuthMiddleware, electionsController.voteElection);
electionsRouter.get('/votations/users', httpAuthMiddleware, electionsController.getVotationsByUser);

export default electionsRouter;