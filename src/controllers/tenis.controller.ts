import { Request, Response } from 'express';
import Tenis from '../models/tenis.model.js';

export const createTenis = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = req.body;

        const tenis = new Tenis({
            id: "",
            name: data.name as string,
            brand: data.brand as string,
            img: data.img as string
        });

        await tenis.create();

        return res.status(201).json({
            success: true,
            tenis,
            message: "se creó el tenis correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al crear el tenis",
            error: (error as Error).message
        });
    }
}

export const index = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        const offset = (page - 1) * limit;

        const tenis = await Tenis.findAll(limit, offset);

        return res.status(200).json({
            success: true,
            tenis,
            message: "se obtuvieron los tenis correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al obtener los tenis",
            error: (error as Error).message
        });
    }
}

export const getById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const tenis = await Tenis.findById(id);

        if (!tenis) {
            return res.status(404).json({
                success: false,
                message: "no se encontró el tenis"
            });
        }

        return res.status(200).json({
            success: true,
            tenis,
            message: "se obtuvo el tenis correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al obtener el tenis",
            error: (error as Error).message
        });
    }
}
