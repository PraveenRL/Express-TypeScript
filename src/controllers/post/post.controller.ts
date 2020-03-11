import { Router, Request, Response } from "express";
import { getRepository } from "typeorm";

import IController from "../../interface/controller.interface";
import Post from "./post.entity";
import RequestWithUser from "../../interface/requestWithUser.interface";

class PostController implements IController {
    public path: string = '/post';
    public router = Router();
    private postRepository = getRepository(Post);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/createPost`, this.createPost);
        this.router.get(`${this.path}/getAllPost`, this.getAllPost);
        this.router.get(`${this.path}/getById/:id`, this.getById);
        this.router.patch(`${this.path}/modifyPost/:id`, this.modifyPost);
        this.router.delete(`${this.path}/deletePost/:id`, this.deletePost);

        this.router.post(`${this.path}/manyToOne`, this.manyToOne);
        this.router.post(`${this.path}/manyToMany`, this.manyToMany);
    }

    private createPost = async (request: Request, response: Response) => {
        const postData: Post = request.body;
        const newPost = this.postRepository.create(postData);   //create - creates a new instance of a Post
        await this.postRepository.save(newPost);                //The instance can afterward be saved using the save.
        response.send(newPost);
    }

    private getAllPost = async (request: Request, response: Response) => {
        const posts = await this.postRepository.find();
        response.send(posts);
    }

    private getById = async (request: Request, response: Response) => {
        const id = request.params.id;
        const post = await this.postRepository.findOne(id, {relations: ['categories']});
        if (post) {
            response.send(post);
        } else {
            console.log('Error by id');
        }
    }

    private modifyPost = async (request: Request, response: Response) => {
        const postData: Post = request.body;
        const id = request.params.id;
        await this.postRepository.update(id, postData);
        const updatedPost = await this.postRepository.findOne(id);
        if (updatedPost) {
            response.send(updatedPost);
        } else {
            console.log('Could not be updated');
        }
    }

    private deletePost = async (request: Request, response: Response) => {
        const id = request.params.id;
        const deleteResponse = await this.postRepository.delete(id);
        if (deleteResponse) {
            response.send(deleteResponse);
        } else {
            console.log('Error while deleting');
        }
    }

    private manyToOne = async (request: RequestWithUser, response: Response) => {   //Not cleared
        const postData = request.body;
        const newPost = this.postRepository.create({
            ...postData,
            author: request.user
        });
        await this.postRepository.save(newPost);
        response.send(newPost);
    }

    private manyToMany = async (request: Request, response: Response) => {   
        const postData = request.body;
        const newPost = this.postRepository.create(postData);
        await this.postRepository.save(newPost);
        response.send(newPost);
    }


}

export default PostController;