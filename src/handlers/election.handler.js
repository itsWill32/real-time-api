import Election from '../models/election.model.js';

export const registerElectionHandlers = (io, socket) => {

    const voteElection = async (payload) => {
        try {
            const { electionId, option } = payload;
            //option can be "optionOne" o "optionTwo"

            const updatedElection = await Election.vote(option, electionId);

            if (!updatedElection) {
                socket.emit("election:vote_error", {
                    success: false,
                    message: "No se encontró la elección o la opción es inválida"
                });
                return;
            }

            if (updatedElection.expiration < new Date()) {
                socket.emit("election:vote_error", {
                    success: false,
                    message: "La elección ha expirado"
                });
                return;
            }

            io.emit("election:vote_success", {
                success: true,
                election: updatedElection,
                message: "Se registró el voto correctamente"
            });
        } catch (error) {
            socket.emit("election:vote_error", {
                success: false,
                message: "Ocurrió un error al registrar el voto",
                error: error.message
            });
        }
    };

    socket.on("election:vote", voteElection);
};

// Ejemplo de frontend para enviar un voto a través de WebSocket
// <body>
//     <script>
//         // Conectar al servidor WebSocket
//         const ws = new WebSocket('ws://localhost:3004');

//         // Manejar la conexión abierta
//         ws.onopen = () => {
//             console.log('Conectado al servidor WebSocket');

//             // Enviar un mensaje de voto
//             const voteMessage = {
//                 type: 'election:vote',
//                 payload: {
//                     electionId: '60d1f965bc64a35d88f9e345',
//                     option: 'optionOne'
//                 }
//             };

//             ws.send(JSON.stringify(voteMessage));
//         };

//         // Manejar mensajes recibidos
//         ws.onmessage = (event) => {
//             const message = JSON.parse(event.data);
//             console.log('Mensaje recibido del servidor:', message);
//         };

//         // Manejar la conexión cerrada
//         ws.onclose = () => {
//             console.log('Conexión cerrada');
//         };

//         // Manejar errores
//         ws.onerror = (error) => {
//             console.error('Error en la conexión WebSocket:', error);
//         };
//     </script>
// </body>
