import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

import errorMiddleWare from './middleware/error.middleware';

class App {
    public app: express.Application;
    public port: number;
    public mongoDbConfig: string = "mongodb://localhost:27017/exty"

    constructor(controllers, port) {
        this.app = express();
        this.port = port;
        this.initializeMiddlewares();
        this.connectToDatabase();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private initializeErrorHandling(){
        this.app.use(errorMiddleWare)
    }

    private connectToDatabase() {
        mongoose.connect(this.mongoDbConfig, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }).then(() => {
            console.log('Database connected');
        }).catch(error => console.log(`Database could not be connected ${error}`))
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;