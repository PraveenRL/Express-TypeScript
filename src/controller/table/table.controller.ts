import { Router, Request, Response } from "express";

import IController from "../../interface/controller.interface";
import { pool } from "../../queries";


class TableController implements IController {
    public path: string = '/table';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/createUserTable`, this.createUserTable);
        this.router.get(`${this.path}/createBusTable`, this.createBusTable);
        this.router.get(`${this.path}/createTripTable`, this.createTripTable);
        this.router.get(`${this.path}/createBookingTable`, this.createBookingTable);
        this.router.get(`${this.path}/dropUsersTable`, this.dropUsersTable);
        this.router.get(`${this.path}/dropBusTable`, this.dropBusTable);
        this.router.get(`${this.path}/dropTripTable`, this.dropTripTable);
        this.router.get(`${this.path}/dropBookingTable`, this.dropBookingTable);
    }

    private createUserTable = async (request: Request, response: Response) => {
        const sql: string = `CREATE TABLE IF NOT EXISTS users(   
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            password VARCHAR(100) NOT NULL,
            created_on DATE NOT NULL
        )`;
        await pool.query(sql).then(result => {
            console.log('Table Created');
            response.send(result);
        }).catch(error => {
            console.log(error);
            response.status(400).send(error);
        })
    }

    private createBusTable = async (request: Request, response: Response) => {
        const sql: string = `
        CREATE TABLE IF NOT EXISTS bus(
            id SERIAL PRIMARY KEY,
            number_plate VARCHAR(100) NOT NULL,
            manufacturer VARCHAR(100) NOT NULL,
            model VARCHAR(100) NOT NULL,
            year VARCHAR(10) NOT NULL,
            capacity INT NOT NULL,
            created_on DATE NOT NULL
        )`;
        await pool.query(sql).then(result => {
            response.send(result);
            console.log('Bus Table created');
        }).catch(error => {
            console.log(error);
            response.status(400).send(error)
        })
    }

    private createTripTable = async (request: Request, response: Response) => {
        const sql: string = `CREATE TABLE IF NOT EXISTS trip(
            id SERIAL PRIMARY KEY,
            bus_id INTEGER REFERENCES bus(id) ON DELETE CASCADE,
            origin VARCHAR(300) NOT NULL,
            destination VARCHAR(300) NOT NULL,
            trip_date DATE NOT NULL,
            fare float NOT NULL,
            status float DEFAULT(1.00),
            created_on DATE NOT NULL
        )`;
        await pool.query(sql).then(result => {
            response.send(result);
            console.log('Trip Table Created');
        }).catch(error => {
            response.status(400).send(error);
            console.log(error);
        })
    }

    private createBookingTable = async (request: Request, response: Response) => {
        const sql: string = `CREATE TABLE IF NOT EXISTS booking(
            id SERIAL,
            trip_id INTEGER REFERENCES trip(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            bus_id INTEGER REFERENCES bus(id) ON DELETE CASCADE,
            trip_date DATE,
            seat_number INTEGER UNIQUE,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            created_on DATE NOT NULL,
            PRIMARY KEY(id, trip_id, user_id)
        )`;
        await pool.query(sql).then(result => {
            response.send(result);
            console.log('Booking table created');
        }).catch(error => {
            response.status(400).send(error);
            console.log(`Booking table : ${error}`);
        })
    }

    private dropUsersTable = async (request: Request, response: Response) => {
        const sql: string = `DROP TABLE IF EXISTS users`;
        await pool.query(sql).then(result => {
            response.send(result);
            console.log('users table dropped');
        }).catch(error => {
            response.status(400).send(error);
            console.log(`Drop users table : ${error}`);
        })
    }

    private dropBusTable = async (request: Request, response: Response) => {
        const sql: string = `DROP TABLE IF EXISTS bus`;
        await pool.query(sql).then(result => {
            response.send(result);
            console.log('bus table dropped');
        }).catch(error => {
            response.status(400).send(error);
            console.log(`Drop bus table : ${error}`);
        })
    }

    private dropTripTable = async (request: Request, response: Response) => {
        const sql: string = `DROP TABLE IF EXISTS trip`;
        await pool.query(sql).then(result => {
            response.send(result);
            console.log('trip table dropped');
        }).catch(error => {
            response.status(400).send(error);
            console.log(`Drop bus table : ${error}`);
        })
    }

    private dropBookingTable = async (request: Request, response: Response) => {
        const sql: string = `DROP TABLE IF EXISTS booking`;
        await pool.query(sql).then(result => {
            response.send(result);
            console.log('booking table dropped');
        }).catch(error => {
            response.status(400).send(error);
            console.log(`Drop bus table : ${error}`);
        })
    }


}

export default TableController;