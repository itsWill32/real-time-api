import { Router } from "express";
import * as electionsController from "../controllers/elections.controller";
import { httpAuthMiddleware } from "../middlewares/http/auth.middleware";

const electionsRouter = Router();

electionsRouter.get('/', electionsController.index);
electionsRouter.get('/:id', electionsController.show);
electionsRouter.post('/', httpAuthMiddleware, electionsController.createElection);
electionsRouter.patch('/:id', httpAuthMiddleware, electionsController.updateElection);
electionsRouter.delete('/:id', httpAuthMiddleware, electionsController.deleteElection);
electionsRouter.get('/new/permissions/users/', electionsController.refreshElectionsByUser);
electionsRouter.post('/vote/:election', httpAuthMiddleware, electionsController.voteElection);
electionsRouter.get('/votations/users', httpAuthMiddleware, electionsController.getVotationsByUser);
electionsRouter.post('/expired', electionsController.electionExpired);

export default electionsRouter;