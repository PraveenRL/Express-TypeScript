import * as bcrypt from 'bcryptjs';
import { Router, Request, Response, NextFunction } from 'express';

import { IController } from '../../interfaces/controller.interface';
import UserDto from './user.dto';
import UserModel from './user.model';
import Token, { IToken } from '../../helper/token';
import HttpException from '../../exceptions/http.exceptions';
import authMiddleWare from '../../middleware/auth.middleware';
import PostModel from '../../controller/post/post.model';
import RequestWithUser from '../../interfaces/requestWithUser.interface';

// import * as express from 'express';
class UserController implements IController {
    public path: string = "/user";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.registration);
        this.router.post(`${this.path}/login`, this.logginIn);
        this.router.get(`${this.path}/logout`, this.logout);
        this.router
            .all(`${this.path}*`, authMiddleWare)
            .post(this.path, authMiddleWare, this.createPost);
    }

    private registration = async (request: Request, response: Response, next: NextFunction) => {
        const userData: UserDto = request.body;
        if (await UserModel.findOne({ email: userData.email })) {
            next(new HttpException(400, "Email Already Exist"));
        } else {
            const hash = await bcrypt.hash(userData.password, 10);
            const user = await UserModel.create({
                ...userData,
                password: hash
            });
            user.password = undefined;
            const tokenData = Token(user);
            response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
            response.send(user);
        }
    }

    private logginIn = async (request: Request, response: Response, next: NextFunction) => {
        const loginData = request.body;
        const user = await UserModel.findOne({ email: loginData.email });
        if (user) {
            const isPasswordMatching = await bcrypt.compare(loginData.password, user.password);
            if (isPasswordMatching) {
                user.password = undefined;
                const tokenData = Token(user);
                response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                response.send(user);
            } else {
                next("Password does not match");
            }
        } else {
            next("User does not Exist");
        }
    }

    private logout = (request: Request, response: Response) => {
        response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        response.status(200).send('Logged out')
    }

    private createPost = async (request: RequestWithUser, response: Response) => {      //Token requires to post
        const postData = request.body;
        const createdPost = new PostModel({
            content: request.user.email,
            title: request.user.name,
            authorId: request.user._id
        });
        const savedPost = await createdPost.save();
        response.send(savedPost);
    }

    private createCookie(tokenData: IToken) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`
    }
}

export default UserController;