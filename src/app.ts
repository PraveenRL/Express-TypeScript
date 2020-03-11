import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

class App {
    public app: express.Application;
    public port: number;


    constructor(controllers, port) {
        this.app = express();
        this.port = port;
        this.initializeMiddlewares();
        this.connectToDatabase();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    private initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/api', controller.router);
        });
    }

    private initializeErrorHandling() {

    }

    private connectToDatabase() {

    }


    // public pool = new Pool({
    //     user: "me",
    //     host: "localhost",
    //     database: "api",
    //     password: "password",
    //     port: 5432
    // })
}

export default App;