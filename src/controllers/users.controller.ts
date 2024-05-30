import { Request, Response } from 'express';
import User from '../models/user.model';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const salts: number = parseInt(process.env.BCRYPT_SALT as string, 10);

export const index = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string, 10);
        const limit = parseInt(req.query.limit as string, 10);
        const offset = (page - 1) * limit;

        const users = await User.findAll(limit, offset);

        return res.status(200).json({
            success: true,
            users,
            message: "se obtuvieron los usuarios correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al obtener los usuarios",
            error: (error as Error).message
        });
    }
}

export const show = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const user = await User.getById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "no se encontró el usuario"
            });
        }

        return res.status(200).json({
            success: true,
            user,
            message: "se obtuvo el usuario correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al obtener el usuario",
            error: (error as Error).message
        });
    }
}

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const encryptedPassword = bcrypt.hashSync(req.body.password, salts);

        const user = new User({
            ...req.body,
            password: encryptedPassword
        });

        await user.create();

        return res.status(201).json({
            success: true,
            user,
            message: "se creó el usuario correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al crear el usuario",
            error: (error as Error).message
        });
    }
}
