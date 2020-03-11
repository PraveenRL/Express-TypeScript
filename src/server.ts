import { createConnection } from 'typeorm';
import 'reflect-metadata';

import App from './app';
import config from './ormconfig';
import PostController from './controllers/post/post.controller';
import UsersController from './controllers/users/users.controller';
import AddressController from './controllers/address/address.controller';
import CategoryController from './controllers/category/category.controller';

(async () => {
    try {
        await createConnection(config);
        console.log('Database connected')
    } catch (error) {
        console.log(`Error while connecting to the database ${error}`);
        return error;
    }
    const app = new App(
        [
            new PostController(),
            new UsersController(),
            new AddressController(),
            new CategoryController
        ],
        5000
    );
    app.listen();
})();





