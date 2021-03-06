import * as bcrypt from 'bcryptjs';
import { Router, Request, Response, NextFunction } from 'express';

import IController from '../../interfaces/controller.interface';
import UserDto from './user.dto';
import UserModel from './user.model';
import Token, { IToken } from '../../helper/token';
import HttpException from '../../exceptions/http.exceptions';
import authMiddleWare from '../../middleware/auth.middleware';
import PostModel from '../../controller/post/post.model';
import RequestWithUser from '../../interfaces/requestWithUser.interface';
import CreatePostDto from '../../controller/post/post.dto';

// import * as express from 'express';
class UserController implements IController {
    public path: string = "/user";
    public router = Router();

    constructor() {
        this.initializeRoutes();
        this.router.use(this.path, authMiddleWare);
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.registration);
        this.router.post(`${this.path}/login`, this.logginIn);
        this.router.get(`${this.path}/logout`, this.logout);

        this.router
            .all(`${this.path}*`, authMiddleWare)
            .post(`${this.path}/createPost`, authMiddleWare, this.createPost)
            .get(`${this.path}/getAllPost`, this.getAllPost)
            .post(`${this.path}/createPostTwoWayRefering`, this.createPostTwoWayRefering);

        this.router.post(`${this.path}/aggregationMatch`, this.aggregationMatch);
    }

    private createCookie(tokenData: IToken) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`
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
            ...postData,
            authorId: request.user._id  //Relationship One-To-Many(1:N)
        });
        const savedPost = await createdPost.save();
        // await savedPost.populate('authorId').execPopulate();          //Populate -- give all values
        // await savedPost.populate('authorId', 'name').execPopulate();  // [first = find id, second  only]
        await savedPost.populate('authorId', '-password').execPopulate();// [first = find id, second '-'omit]
        response.send(savedPost);
    }

    private getAllPost = async (request: Request, response: Response) => {
        const posts = await PostModel.find().populate('authorId', '-password');
        response.send(posts);
    }

    //Relationship Many-To-Many(N:M) => Two Way Refering 
    private createPostTwoWayRefering = async (request: RequestWithUser, response: Response) => {
        const postData: CreatePostDto = request.body;
        const createdPost = new PostModel({
            ...postData,
            authorsId: [request.user._id]
        });
        const user = await UserModel.findById(request.user._id);
        user.posts = [...user.posts, createdPost._id];
        await user.save();
        const savedPost = await createdPost.save();
        await savedPost.populate('authorsId', '-password').execPopulate();
        response.send(savedPost);
    }

    //Aggregation
    private aggregationMatch = async (request: Request, response: Response) => {
        const arrayOfPosts = await PostModel.aggregate(
            [
                {
                    $match: {
                        email: request.body.email
                    }
                }
            ]
        );
        response.send(arrayOfPosts)
    }


}

export default UserController;