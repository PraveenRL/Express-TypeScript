import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";

import { IController } from "./interfaces/controller.interface";
import { ErrorMiddleware } from "./middlewares/error.middleware";
import { poolFunction } from "../config/database";

export class App {
    public app: express.Application;

    constructor(controllers: IController[]) {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeErrorHandling();
        this.initializeControllers(controllers);
        this.initializeDatabase();
    }

    public listen() {
        this.app.listen(process.env.PORT);
    }

    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: false
        }))
        this.app.use(cors());
        this.app.use(cookieParser());
    }

    private initializeControllers(controllers: IController[]) {
        controllers.forEach((temp) => {
            this.app.use("/api", temp.router)
        });
    }

    private initializeErrorHandling() {
        this.app.use(ErrorMiddleware);
    }

    private initializeDatabase() {
        let pool = poolFunction();
        try {
            pool.connect(() => {
                console.log(`PostgreSQL running`);
            })
        } catch{
            console.log(`Database connection error`);
            pool.end();
        }
    }

}