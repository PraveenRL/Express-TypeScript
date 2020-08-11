import { Router, Request, Response, NextFunction } from "express";

import { IController } from "../interfaces/controller.interface";
import { AuthenticationService } from "../services/authentication.service";
import { validationMiddleWare } from "../middlewares/validation.middleware";
import { CreateUserDTO } from "../validators/create-user.dto";
import { LoginDTO } from "../validators/login.dto";
import { ICreateUser } from "../interfaces/create-user.interface";
import { HttpException } from "../exceptions/http.exception";
import { IRefreshToken } from "../interfaces/token.interface";
import { authMiddleware } from "../middlewares/auth.middleware";

export class AuthenticationController implements IController {
    public path: string = "";
    public router = Router();
    public authenticationService = new AuthenticationService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleWare(CreateUserDTO, false), this.register);
        this.router.post(`${this.path}/login`, validationMiddleWare(LoginDTO, false), this.login);
        this.router.post(`${this.path}/logout`, authMiddleware, this.logout);
        this.router.post(`${this.path}/getRefreshToken`, this.getRefreshToken);
    }

    private register = async (request: Request, response: Response, next: NextFunction) => {
        const requestBody: ICreateUser = request.body;

        try {
            const result: any = await this.authenticationService.registerFromService(requestBody);

            return response.status(201).send(result);
        }
        catch (error) {
            next(new HttpException(401, error));
        }
    }

    private login = async (request: Request, response: Response, next: NextFunction) => {
        const requestBody: LoginDTO = request.body;

        try {
            const result: any = await this.authenticationService.loginFromService(requestBody);

            if (result.tokens) {
                return response.status(200).send(result);
            }
            else {
                next(new HttpException(401, result));
            }

        }
        catch (error) {
            next(new HttpException(401, error));
        }
    }

    private getRefreshToken = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let refreshToken: IRefreshToken = request.body;

            let tokens = this.authenticationService.refreshTokenFromService(refreshToken);
            return response.status(200).send(tokens);
        }
        catch (error) {
            next(new HttpException(401, error));
        }
    }
    
    private logout = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let refreshToken: IRefreshToken = request.body;

            let result = this.authenticationService.logoutFromService(refreshToken);
            response.status(200).send(result);
        }
        catch (error) {
            next(new HttpException(401, 'You are not logged in'))
        }
    }

}