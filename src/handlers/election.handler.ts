import Election from '../models/election.model';
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


//EJEMPLO EN EL FRONT
{/* <body>
    <script>
        const token = "tokenGeneradoEnLogin"; // Supón que ya tienes el token

        // Conectar al servidor WebSocket con el token en la URL
        const ws = new WebSocket(`ws://localhost:3004?token=${token}`);

        // Manejar la conexión abierta
        ws.onopen = () => {
            console.log('Conectado al servidor WebSocket');

            // Enviar un mensaje de voto
            const voteMessage = {
                type: 'election:vote',
                payload: {
                    electionId: '60d1f965bc64a35d88f9e345',
                    option: 'optionOne'
                }
            };

            ws.send(JSON.stringify(voteMessage));
        };

        // Manejar mensajes recibidos
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('Mensaje recibido del servidor:', message);
        };

        // Manejar la conexión cerrada
        ws.onclose = () => {
            console.log('Conexión cerrada');
        };

        // Manejar errores
        ws.onerror = (error) => {
            console.error('Error en la conexión WebSocket:', error);
        };
    </script>
</body> */}