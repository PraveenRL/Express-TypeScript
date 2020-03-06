import App from './app';
import PostController from './controller/post/post.controller';
const app = new App([
    new PostController(),
], 5000);
app.listen();
//# sourceMappingURL=server.js.map