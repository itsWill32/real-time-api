import Election from '../models/election.model.js';
import Votation from '../models/votation.model.js';
import Tenis from '../models/tenis.model.js';
import 'dotenv/config';

// LONG POLLING
let resClients = [];

const refreshElectionsByUser = async (req, res) => {
    try {
        resClients.push(res);

        req.on('close', () => {
            const index = resClients.indexOf(res);
            if (index !== -1) {
                resClients.splice(index, 1);
                res.end();
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error al refrescar las elecciones",
            error: error.message
        });
    }
}

const createElection = async (req, res) => {
    const data = req.body;

    try {
        const electionData = {
            optionOneId: data.optionOneId,
            optionTwoId: data.optionTwoId,
            expiration: data.expiration,
            optionOneVotes: data.optionOneVotes,
            optionTwoVotes: data.optionTwoVotes
        };

        const election = new Election(electionData);
        const createdElection = await election.create();

        refreshClients(election);

        return res.status(201).json({
            success: true,
            election: createdElection,
            message: "Se creó la elección correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error al crear la elección",
            error: error.message
        });
    }
}

function refreshClients(election) {
    resClients.forEach(res => {
        res.status(200).json({
            success: true,
            election
        });
    });
    resClients = [];
}

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;

        const elections = await Election.findAll(limit, offset);

        return res.status(200).json({
            success: true,
            elections,
            message: "Se obtuvieron las elecciones correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error al obtener las elecciones",
            error: error.message
        });
    }
}

const show = async (req, res) => {
    try {
        const id = req.params.id;
        const election = await Election.findById(id);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "No se encontró la elección"
            });
        }

        return res.status(200).json({
            success: true,
            election,
            message: "Se obtuvo la elección correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error al obtener la elección",
            error: error.message
        });
    }
}

const deleteElection = async (req, res) => {
    try {
        const id = req.params.id;
        const election = await Election.delete(id);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "No se encontró la elección"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Se eliminó la elección correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error al eliminar la elección",
            error: error.message
        });
    }
}

const updateElection = async (req, res) => {
    try {
        const id = req.params.id;
        const electionData = {
            ...req.body
        };

        const updatedElection = await Election.update(id, electionData);

        if (!updatedElection) {
            return res.status(404).json({
                success: false,
                message: "No se encontró la elección"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Se actualizó la elección correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error al actualizar la elección",
            error: error.message
        });
    }
}

const voteElection = async (req, res) => {
    try {
        const { id } = req.params.election;
        const { userId } = req.user.id;
        const { option } = req.body;
        let votation;

        const updatedElection = await Election.vote(option, id);

        if (!updatedElection) {
            return res.status(404).json({
                success: false,
                message: "No se encontró la elección o opción inválida"
            });
        }

        if (updatedElection.expiration < new Date()) {
            return res.status(400).json({
                success: false,
                message: "La elección ha expirado"
            });
        }

        if (option === "optionOne") {
            votation = 1;
        } else if (option === "optionTwo") {
            votation = 2;
        }

        const votationObj = new Votation({
            userId,
            electionId: id,
            optionSelected: votation
        });

        await votationObj.create();

        return res.status(200).json({
            success: true,
            election: updatedElection,
            message: "Se registró el voto correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error al registrar el voto",
            error: error.message
        });
    }
}

const getVotationsByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const votations = await Votation.findByUserId(userId);

        return res.status(200).json({
            success: true,
            votations,
            message: "Se obtuvieron las votaciones correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error al obtener las elecciones",
            error: error.message
        });
    }
}

const electionExpired = async () => {
    try {
        const elections = await Election.findAll(0, 0);
        const now = new Date();

        for (const election of elections) {
            if (election.expiration < now && !election.expired) {
                await Election.expire(election.id);

                const votations = await Votation.findByElectionId(election.id);

                const optionOneVotes = election.optionOneVotes;
                const optionTwoVotes = election.optionTwoVotes;

                let winningOption;
                if (optionOneVotes > optionTwoVotes) {
                    winningOption = 'optionOne';
                } else if (optionTwoVotes > optionOneVotes) {
                    winningOption = 'optionTwo';
                } else {
                    winningOption = 'tie';
                }

                let notificationText;
                if (winningOption === 'tie') {
                    notificationText = 'La elección de la votación entre las dos opciones ha terminado en empate.';
                } else {
                    const winningOptionId = winningOption === 'optionOne' ? election.optionOneId : election.optionTwoId;
                    const winningTenis = await Tenis.findById(winningOptionId);

                    notificationText = `El ganador en la última votación en la que participaste es: ${winningTenis.brand} - ${winningTenis.name}.`;
                }

                for (const votation of votations) {
                    const notification = new Notification({
                        electionId: election.id,
                        userId: votation.userId,
                        text: notificationText,
                        active: true
                    });

                    await notification.create();
                }

                refreshClients(election);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

export {
    index,
    show,
    createElection,
    deleteElection,
    updateElection,
    voteElection,
    getVotationsByUser,
    refreshElectionsByUser,
    electionExpired
}