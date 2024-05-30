import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import signale from 'signale';
import 'dotenv/config';
import { connectToDatabase } from './src/configs/db.config.js';

import { router as routes } from './src/routes/index.js';
import { socketioAuthMiddleware } from './src/middlewares/socketio/auth.middleware.js';
import { registerElectionHandlers } from './src/handlers/election.handler.js';

const port = process.env.PORT || 3003;
const origin = process.env.CORSORIGIN;
const httpServerPort = parseInt(port)+1;

const app = express();
connectToDatabase();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: origin
    },
    pingInterval:1000,
    pingTimeout:2000
});

app.use(cors());
app.use(express.json());
app.use(routes);

io.use(socketioAuthMiddleware);

const onConnection = (socket) => {
    // registerDocumentsHandlers(io, socket);
    registerElectionHandlers(io, socket);
    signale.success("Cliente conectado: " + socket.id);
}

io.on('connection', onConnection);

httpServer.listen(port, () => {
    signale.success("Servidor Socket.io iniciado en el puerto " + port);
});

app.listen(httpServerPort, () => {
    signale.success("servidor HTTP iniciado en el puerto " + httpServerPort);
});