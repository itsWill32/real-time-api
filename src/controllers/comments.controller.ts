import Comment from "../models/comment.model";
import User from "../models/user.model";
import { Request, Response } from "express";

export const index = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        const offset = (page - 1) * limit;

        const comments = await Comment.findAll(limit, offset);

        const commentsWithUsername = await Promise.all(comments.map(async (comment) => {
            const username = await User.getUsernameById(comment.userId);
            return { ...comment, username };
        }));

        console.log("comments", commentsWithUsername);

        return res.status(200).json({
            success: true,
            comments: commentsWithUsername,
            message: "se obtuvieron los comentarios correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al obtener los comentarios",
            error: (error as Error).message
        });
    }
}