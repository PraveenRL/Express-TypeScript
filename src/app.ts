import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { Pool, Client } from 'pg';



class App {
    public app: express.Application;
    public port: number;

    // public pool = new Pool({
    //     user: "me",
    //     host: "localhost",
    //     database: "api",
    //     password: "password",
    //     port: 5432
    // })

    constructor(controllers, port) {
        this.app = express();
        this.port = port;
        this.initializeMiddlewares();
        this.connectToDatabase();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();

        // this.getMethod();
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
            this.app.use('/', controller.router);
        });
    }

    // private getMethod(){
    //     this.app.get('/get', async(request, response) => {
    //         const result = await this.pool.query("SELECT * FROM users");
    //         response.send(result.rows);
    //     })
    // }

    private initializeErrorHandling() {

    }

    private connectToDatabase() {

    }


}

export default App;