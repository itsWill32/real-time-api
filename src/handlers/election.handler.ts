import Election from '../models/election.model';
import Votation from '../models/votation.model';
import { WebSocket, WebSocketServer } from 'ws';

interface VotePayload {
    electionId: string;
    option: 'optionOne' | 'optionTwo';
}

export const registerElectionHandlers = (wss: WebSocketServer, ws: WebSocket, payload: VotePayload) => {

    const voteElection = async (payload: VotePayload): Promise<void> => {
        try {
            const { electionId, option } = payload;
            // option puede ser "optionOne" o "optionTwo"
            const userId = (ws as any).user.user.id;

            const updatedElection = await Election.vote(option, electionId);

            if (!updatedElection) {
                ws.send(JSON.stringify({
                    type: "election:vote_error",
                    success: false,
                    message: "No se encontró la elección o la opción es inválida"
                }));
                return;
            }

            if (updatedElection.expiration < new Date()) {
                ws.send(JSON.stringify({
                    type: "election:vote_error",
                    success: false,
                    message: "La elección ha expirado"
                }));
                return;
            }

            //Crear votación
            console.log("userId", userId);
            const votation = new Votation({
                userId,
                electionId,
                optionSelected: option === "optionOne" ? 1 : 2
            });

            await votation.create();

            // Enviar éxito al cliente que votó
            ws.send(JSON.stringify({
                type: "election:vote_success",
                success: true,
                election: updatedElection,

                message: "Se registró el voto correctamente"
            }));

            // Notificar a todos los demás clientes
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "election:vote_update",
                        election: updatedElection
                    }));
                }
            });
        } catch (error) {
            ws.send(JSON.stringify({
                type: "election:vote_error",
                success: false,
                message: "Ocurrió un error al registrar el voto",
                error: (error as Error).message
            }));
        }
    };

    // Llamar a voteElection con el payload recibido
    voteElection(payload);
};