import { Router, Request, Response } from "express";
import { getRepository } from "typeorm";

import IController from "../../interface/controller.interface";
import Users from "./users.entity";

class UsersController implements IController {
    public path: string = "/user";
    public router = Router();
    private userRepository = getRepository(Users)

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/createUser`, this.createUser);
        this.router.get(`${this.path}/getAllUsers`, this.getAllUsers);
        this.router.get(`${this.path}/getUserById/:id`, this.getUserById);
        this.router.patch(`${this.path}/modifyUser/:id`, this.modifyUser);
        this.router.delete(`${this.path}/deleteUser/:id`, this.deleteUser);
    }

    private createUser = async (request: Request, response: Response) => {
        const userData = request.body;
        const createInstance = this.userRepository.create(userData);
        await this.userRepository.save(createInstance);
        response.send(createInstance)
    }

    private getAllUsers = async (request: Request, response: Response) => {
        const getUsers = await this.userRepository.find();
        response.send(getUsers);
    }

    private getUserById = async (request: Request, response: Response) => {
        const id = request.params.id;
        const getIdUser = await this.userRepository.findOne(id);
        if (getIdUser) {
            response.send(getIdUser);
        } else {
            response.status(404).send('Not user found');
        }
    }

    private modifyUser = async (request: Request, response: Response) => {
        const userData = request.body;
        const id = request.params.id;
        const patchUser = await this.userRepository.update(id, userData);
        console.log(patchUser);
        const getUpdatedUser = await this.userRepository.findOne(id);
        if(getUpdatedUser){
            response.send(getUpdatedUser);
        } else {
            response.status(400).send('Could not update');
        }
    }

    private deleteUser = async (request: Request, response: Response) => {
        const id = request.params.id;
        const deleteUser = await this.userRepository.delete(id);
        if(deleteUser){
            response.send(deleteUser);
        } else {
            response.status(400).send('Could not be deleted')
        }
    }


}

export default UsersController;