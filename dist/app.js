import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import errorMiddleWare from './middleware/error.middleware';
class App {
    constructor(controllers, port) {
        this.mongoDbConfig = "mongodb://localhost:27017/exty";
        this.app = express();
        this.port = port;
        this.initializeMiddlewares();
        this.connectToDatabase();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use(bodyParser.json());
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    initializeErrorHandling() {
        this.app.use(errorMiddleWare);
    }
    connectToDatabase() {
        mongoose.connect(this.mongoDbConfig, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }).then(() => {
            console.log('Database connected');
        }).catch(error => console.log(`Database could not be connected ${error}`));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}
export default App;
//# sourceMappingURL=app.js.map