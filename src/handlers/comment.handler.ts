import Comment from '../models/comment.model';
import User from '../models/user.model';
import { WebSocket, WebSocketServer } from 'ws';

interface CommentPayload {
    text: string;
}

export const registerCommentHandlers = (wss: WebSocketServer, ws: WebSocket, payload: CommentPayload) => {

    const addComment = async (payload: CommentPayload): Promise<void> => {
        try {
            const { text } = payload;
            const userId = (ws as any).user.user.id;

            if (!text || text.trim() === ""){
                ws.send(JSON.stringify({
                    type: "comment:text_error",
                    success: false,
                    message: "El texto es requerido"
                }));
                return;
            }

            const comment = new Comment({
                userId,
                text
            });

            const commentObj = await comment.create();
            const username = await User.getUsernameById(userId);

            const resComment = {
                ...commentObj,
                username
            }

            if (!commentObj) {
                ws.send(JSON.stringify({
                    type: "comment:create_error",
                    success: false,
                    message: "Ocurrió un error al crear el comentario"
                }));
                return;
            }

            console.log("resComment", resComment);

            ws.send(JSON.stringify({
                type: "comment:comment_success",
                success: true,
                comment: resComment,
                message: "Se registró el comentario correctamente"
            }));

            // Notificar a todos los demás clientes
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "comment:comments_update",
                        comment: resComment
                    }));
                }
            });
        } catch (error) {
            ws.send(JSON.stringify({
                type: "comment:comment_error",
                success: false,
                message: "Ocurrió un error al registrar el comentario",
                error: (error as Error).message
            }));
        }
    };

    addComment(payload);
};