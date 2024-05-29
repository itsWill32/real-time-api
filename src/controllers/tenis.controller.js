import Tenis from "../models/tenis.model.js";

const createTenis = async (req, res) => {
    try {
        const data = req.body;

        const tenis = new Tenis({
            name: data.name,
            brand: data.brand,
            img: data.img
        });

        await tenis.create();

        return res.status(201).json({
            success: true,
            tenis,
            message: "se creó el tenis correctamente"
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al crear el tenis",
            error: error.message
        });
    }
}

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
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
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const id = req.params.id;
        const tenis = await Tenis.getById(id);

        if (!tenis) {
            return res.status(404).json({
                success: false,
                message: "no se encontró el usuario"
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
            error: error.message
        });
    }
}

export {
    createTenis,
    index,
    getById
}