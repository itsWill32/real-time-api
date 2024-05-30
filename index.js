import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import signale from 'signale';
import 'dotenv/config';
import { connectToDatabase } from './src/configs/db.config.js';

import { router as routes } from './src/routes/index.js';
import { registerElectionHandlers } from './src/handlers/election.handler.js';

const port = process.env.PORT || 3003;
const origin = process.env.CORSORIGIN;
const httpServerPort = parseInt(port) + 1;

const app = express();
connectToDatabase();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use(routes);

// Crear una instancia de WebSocketServer
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        // Puedes manejar diferentes tipos de mensajes aquí
        if (data.type === 'election:vote') {
            registerElectionHandlers(wss, ws, data.payload);
        }
    });
    signale.success("Cliente conectado");
});

server.listen(httpServerPort, () => {
    signale.success("Servidor HTTP y WebSocket iniciado en el puerto " + httpServerPort);
});