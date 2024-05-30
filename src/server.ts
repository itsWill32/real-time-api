import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import signale from 'signale';
import 'dotenv/config';
import { connectToDatabase } from "./configs/db.config"
import { router as routes } from './routes/index';
import { registerElectionHandlers } from './handlers/election.handler';
import { websocketAuthMiddleware } from './middlewares/websocket/auth.middleware';

const port: number | string = process.env.PORT || 3003;
// const origin: string | undefined = process.env.CORSORIGIN;
const httpServerPort: number = parseInt(port as string) + 1;

const app = express();
connectToDatabase();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use(routes);

// Crear una instancia de WebSocketServer
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket, req: express.Request) => {
    websocketAuthMiddleware(ws, req, () => {
        ws.on('message', (message: any) => {
            const data = JSON.parse(message.toString());
            // Puedes manejar diferentes tipos de mensajes aquí
            if (data.type === 'election:vote') {
                registerElectionHandlers(wss, ws, data.payload);
            }
        });
        signale.success("Cliente conectado: " + (ws as any).user);
    });
});

server.listen(httpServerPort, () => {
    signale.success("Servidor HTTP iniciado en el puerto " + httpServerPort + " y servidor WebSocket iniciado en el puerto " + port);
});
