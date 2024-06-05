    import express from 'express';
    import { createServer } from 'http';
    import { WebSocketServer, WebSocket } from 'ws';
    import cors from 'cors';
    import signale from 'signale';
    import morgan from 'morgan';
    import 'dotenv/config';
    import { connectToDatabase } from "./configs/db.config"
    import { router as routes } from './routes/index';
    import { registerElectionHandlers } from './handlers/election.handler';
    import { registerCommentHandlers } from './handlers/comment.handler';
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
    app.use(morgan('dev'));

    // Crear una instancia de WebSocketServer
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket, req: express.Request) => {
        websocketAuthMiddleware(ws, req, () => {
            ws.on('message', (message: any) => {
                const data = JSON.parse(message.toString());
                // Se manejan diferentes tipos de eventos
                if (data.type === 'election:vote') {
                    registerElectionHandlers(wss, ws, data.payload);
                }

                if(data.type === 'comment:add'){
                    registerCommentHandlers(wss, ws, data.payload);
                }
            });
            signale.success("Cliente conectado: " + (ws as any).user);
        });
    });

    server.listen(httpServerPort, () => {
        signale.success("Servidor HTTP y Websocket iniciado en el puerto " + httpServerPort);
    });