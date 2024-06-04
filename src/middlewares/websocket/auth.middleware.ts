import jwt from 'jsonwebtoken';
import { WebSocket } from 'ws';

const secretJWT = process.env.SECRET_JWT as string || 'secret';
const { verify } = jwt;

const authenticate = (ws: WebSocket, req: any, next: any): void => {
    const token = req.url.split('token=')[1]; // Obtener el token de la URL
    
    if (!token) {
        ws.close(1008, 'Token de autenticación no proporcionado');
        return;
    }

    verify(token, secretJWT, (err: any, decoded: any) => {
        if (err) {
            ws.close(1008, 'Token de autenticación inválido');
            return;
        }

        (ws as any).user = decoded;
        next();
    });
};

export { authenticate as websocketAuthMiddleware };
