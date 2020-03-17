import * as express from "express";
import IController from "./interface/controller.interface";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";

import { pool } from './queries';

class App {
    public app: express.Application;
    public port: number;
    public router = express.Router();

    constructor(controllers: IController[], port: number) {
        this.app = express();
        this.port = port;
        this.initializeController(controllers);
        this.initializeMiddleware();
        this.initializeDatabase();
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App running in port ${this.port}`);
        });
    }

    private initializeController(controllers: IController[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        })
    }

    private initializeMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    private initializeDatabase() {
        try {
            pool.connect(() => {
                console.log('PostgreSQL running');
            })
        }
        catch{
            console.log('Database connection error');
            process.exit(1);
        }
    }


}

export default App;