import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const secretJWT = process.env.SECRET_JWT as string;
const { verify } = jwt;

interface CustomRequest extends Request {
    user?: any;
}

const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction): void => {
    try {
        const token = req.get('Authorization');

        if (!token) {
            res.status(401).json({
                message: "Token no proporcionado",
            });
            return;
        }

        verify(token, secretJWT, (err, decode) => {
            if (err) {
                res.status(401).json({
                    message: "Error al validar token",
                    error: err.message
                });
                return;
            }

            req.user = (decode as { user: any }).user;
            next();
        });
    } catch (error) {
        res.status(401).json({
            message: "Error al validar token",
            error: (error as Error).message
        });
    }
};

export { verifyJWT as httpAuthMiddleware };