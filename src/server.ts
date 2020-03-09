import App from './app';
import PostController from './controller/post/post.controller';
import UserController from './controller/user/user.controller';
import AggregationController from './controller/aggregation/aggregation.controller';

const app = new App(
    [
        new PostController(),
        new UserController(),
        new AggregationController()
    ],
    5000
);

app.listen();


