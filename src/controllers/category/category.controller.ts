import * as express from 'express';
import { getRepository } from 'typeorm';
import IController from '../../interface/controller.interface';
import Category from './category.entity';

class CategoryController implements IController {
  public path = '/categories';
  public router = express.Router();
  private categoryRepository = getRepository(Category);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllCategories);
    this.router.get(`${this.path}/:id`, this.getCategoryById);
    this.router.post(this.path, this.createCategory);
  }

  private getAllCategories = async (request: express.Request, response: express.Response) => {
    const categories = await this.categoryRepository.find({ relations: ['posts'] });
    response.send(categories);
  }

  private getCategoryById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const category = await this.categoryRepository.findOne(id, { relations: ['posts'] });
    if (category) {
      response.send(category);
    } else {
      next();
    }
  }

  private createCategory = async (request: express.Request, response: express.Response) => {
    const categoryData = request.body;
    const newCategory = this.categoryRepository.create(categoryData);
    await this.categoryRepository.save(newCategory);
    response.send(newCategory);
  }
}

export default CategoryController;