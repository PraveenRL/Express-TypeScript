import App from './app';
import { createConnection } from 'typeorm';
import 'reflect-metadata';

import config from './ormconfig';
import PostController from './controllers/post/post.controller';

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
            new PostController()
        ],
        5000
    );
    app.listen();
})();





