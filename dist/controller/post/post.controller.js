import * as express from 'express';
import PostModel from './post.model';
import HttpException from '../../exceptions/http.exceptions';
import PostNotFoundException from '../../exceptions/postnotfound.exception';
import CreatePostDto from './post.dto';
import validationMiddleware from '../../middleware/validation.middleware';
class PostsController {
    constructor() {
        this.path = '/posts';
        this.router = express.Router();
        this.createAPost = (request, response) => {
            PostModel.create(request.body, (error, result) => {
                if (error)
                    throw error;
                response.send(result);
            });
        };
        this.getAllPosts = (request, response) => {
            PostModel.find((error, result) => {
                if (error)
                    throw error;
                response.send(result);
            });
        };
        this.getById = (request, response, next) => {
            const id = request.params.id;
            PostModel.findById(id)
                .then((result) => {
                if (result) {
                    response.send(result);
                }
                else {
                    next(new HttpException(404, 'id not found'));
                }
            }).catch(error => response.send(error));
        };
        this.modifyPost = (request, response, next) => {
            const id = request.params.id;
            const postData = request.body;
            PostModel.findByIdAndUpdate(id, postData, { new: true })
                .then((result) => {
                if (result) {
                    response.send(result);
                }
                else {
                    next(new PostNotFoundException(id));
                }
            });
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.post(this.path, validationMiddleware(CreatePostDto, true), this.createAPost);
        this.router.get(`${this.path}/:id`, this.getById);
        this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost);
    }
}
export default PostsController;
//# sourceMappingURL=post.controller.js.map