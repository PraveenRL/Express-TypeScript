import { Router, Request, Response } from "express";
import { getRepository } from "typeorm";

import IController from "../../interface/controller.interface";
import Address from "./address.entity";

class AddressController implements IController {
    public path: string = "/address";
    public router = Router();
    private addressRepository = getRepository(Address);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/createAddress`, this.createAddress);
        this.router.get(`${this.path}/getAllAddress`, this.getAllAddress);
        this.router.get(`${this.path}/getAddressById/:id`, this.getAddressById);
        this.router.patch(`${this.path}/updateAddress/:id`, this.updateAddress);
        this.router.delete(`${this.path}/deleteAddress/:id`, this.deleteAddress);
    }

    private createAddress = async (request: Request, response: Response) => {
        const addressData = request.body;
        const createInstance = await this.addressRepository.create(addressData);
        await this.addressRepository.save(createInstance);
        response.send(createInstance)
    }

    private getAllAddress = async (request: Request, response: Response) => {
        const allAddress = await this.addressRepository.find({relations: ['users']});
        response.send(allAddress);
    }

    private getAddressById = async (request: Request, response: Response) => {
        const id = request.params.id;
        const getIdAddress = await this.addressRepository.findOne(id);
        if (getIdAddress) {
            response.send(getIdAddress);
        } else {
            response.status(404).send('No address found')
        }
    }

    private updateAddress = async (request: Request, response: Response) => {
        const id = request.params.id;
        const dataFromRequest = request.body;
        await this.addressRepository.update(id, dataFromRequest);
        const updated = await this.addressRepository.findOne(id);
        if (updated) {
            response.send(updated);
        } else {
            response.status(400).send('Could not be updated');
        }
    }

    private deleteAddress = async (request: Request, response: Response) => {
        const id = request.params.id;
        const deleted = await this.addressRepository.delete(id);
        if (deleted) {
            response.send(deleted);
        } else {
            response.status(400).send('Could not be deleted');
        }
    }


}

export default AddressController;