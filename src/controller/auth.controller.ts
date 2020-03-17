import { Router, Request, Response } from "express";
import { pool } from "../queries";

class AuthController {
    public path: string = '/auth';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get(`${this.path}/testDB`, this.testDB);
        // this.router.get(`${this.path}/createDatabase`, this.createDatabase);
    }

    // private createDatabase = async (request: Request, response: Response) => {
    //     let query = `
    //     CREATE DATABASE test WITH 
    //     ENCODING = 'UTF8' 
    //     OWNER = pg_ts 
    //     CONNECTION LIMIT = 5;`
    //     pool.query(query).then(res => {
    //         response.send(res);
    //     }).catch(error => {
    //         response.send(error);
    //     })
    // }

    private testDB = (request: Request, response: Response) => {
        let query = 'SELECT * FROM post;'
        pool.query(query).then(res => {
            response.send(res.rows);
        }).catch(error => {
            response.send(error);
        })
    }

}

export default AuthController;