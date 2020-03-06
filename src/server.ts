// //Middleware-------------
// function loggerMiddleware(request: express.Request, response: express.Response, next) {
//     console.log(`${request.method} ${request.path}`);
//     next();
// }
// app.use(loggerMiddleware);

import App from './app';
import PostController from './controller/post/post.controller';

const app = new App(
    [
        new PostController(),
    ],
    5000
);

app.listen();


