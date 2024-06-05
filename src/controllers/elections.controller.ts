import Election from '../models/election.model';
import Votation from '../models/votation.model';
import Tenis from '../models/tenis.model';
import Notification from '../models/notification.model';
import { Request, Response } from 'express';
import 'dotenv/config';

// LONG POLLING
let resClients: Response[] = [];

interface CustomRequest extends Request {
    user?: any;
}

const refreshElectionsByUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        resClients.push(res);

        req.on('close', () => {
            const index = resClients.indexOf(res);
            if (index !== -1) {
                resClients.splice(index, 1);
                res.end();
            }
        });

        return res;
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error al refrescar las elecciones",
            error: (error as Error).message
        });
    }
}

const createElection = async (req: Request, res: Response): Promise<Response> => {
    const data = req.body;

    try {
        const electionData = {
            id: "",
            optionOneId: data.optionOneId as string,
            optionTwoId: data.optionTwoId as string,
            expiration: data.expiration as Date,
            optionOneVotes: data.optionOneVotes as number,
            optionTwoVotes: data.optionTwoVotes as number
        };

        const election = new Election(electionData);
        const createdElection = await election.create();

        refreshClients(createdElection);

        return res.status(201).json({
            success: true,
            election: createdElection,
            message: "Se creó la elección correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error al crear la elección",
            error: (error as Error).message
        });
    }
}

function refreshClients(election: any): void {
    resClients.forEach(res => {
        res.status(200).json({
            success: true,
            election
        });
    });
    resClients = [];
}

const index = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
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
            error: (error as Error).message
        });
    }
}

const show = async (req: Request, res: Response): Promise<Response> => {
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
            error: (error as Error).message
        });
    }
}

const deleteElection = async (req: Request, res: Response): Promise<Response> => {
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
            error: (error as Error).message
        });
    }
}

const updateElection = async (req: Request, res: Response): Promise<Response> => {
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
            error: (error as Error).message
        });
    }
}

const voteElection = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userId = (req as CustomRequest ).user.id;
        const { option } = req.body;
        let votation: number | undefined;

        const updatedElection = await Election.vote(option, id);

        if (!updatedElection) {
            return res.status(404).json({
                success: false,
                message: "No se encontró la elección o opción inválida"
            });
        }

        if (new Date(updatedElection.expiration) < new Date()) {
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
            id: "",
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
            error: (error as Error).message
        });
    }
}

const getVotationsByUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).user.id;
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
            error: (error as Error).message
        });
    }
}

//short polling
const electionExpired = async (req: Request, res: Response): Promise<Response> => {
    try {
        const elections = await Election.findAll(0, 0);
        const now = new Date();

        for (const election of elections) {
            if (new Date(election.expiration) < now && !election.expired) {
                console.log('Expirando elección', election.id)
                await Election.expire(election.id);

                const votations = await Votation.findByElectionId(election.id);

                const optionOneVotes = election.optionOneVotes;
                const optionTwoVotes = election.optionTwoVotes;

                let winningOption: string;
                if (optionOneVotes > optionTwoVotes) {
                    winningOption = 'optionOne';
                } else if (optionTwoVotes > optionOneVotes) {
                    winningOption = 'optionTwo';
                } else {
                    winningOption = 'tie';
                }

                let notificationText: string;
                if (winningOption === 'tie') {
                    notificationText = 'La elección de la votación entre las dos opciones ha terminado en empate.';
                } else {
                    const winningOptionId = winningOption === 'optionOne' ? election.optionOneId : election.optionTwoId;
                    const winningTenis = await Tenis.findById(winningOptionId);

                    if (winningTenis) {
                        notificationText = `El ganador en la última votación en la que participaste es: ${winningTenis.brand} - ${winningTenis.name}.`;
                    } else {
                        notificationText = 'No se encontró el ganador de la última votación.';
                    }
                }

                for (const votation of votations) {
                    const notification = new Notification({
                        id: "",
                        electionId: election.id as string,
                        userId: votation.userId,
                        text: notificationText,
                        active: true
                    });

                    await notification.create();
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: "Se han expirado las elecciones correctamente"
        });

        


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error al expirar las elecciones",
            error: (error as Error).message
        });
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