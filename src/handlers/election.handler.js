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