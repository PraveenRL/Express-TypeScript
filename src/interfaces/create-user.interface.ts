import { Request } from "express";
import { QueryResult } from "pg";

export interface ICreateUser {
    first_name: string;
    last_name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    address: string;
    password_hashed: string;
}

export interface ILogin {
    userName: string;
    password: string;
}

export interface RequestWithUser extends Request {
    user: QueryResult<any>;
}