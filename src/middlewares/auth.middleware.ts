import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

import { poolFunction } from "../../config/database";
import { HttpException } from "../exceptions/http.exception";
import { IDataStoredToken } from "../interfaces/token.interface";
import { RequestWithUser } from "../interfaces/create-user.interface";

export async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {

    const token = '' + request.headers.access_token;
    let pool = poolFunction();

    if (token != undefined && token) {
        const secret: string = '' + process.env.JWT_SECRET;

        try {
            const verificationResponse = jwt.verify(token, secret) as IDataStoredToken;
            const id = verificationResponse._id;
            let sql: string = `SELECT * FROM admin_user WHERE 
            (email = '${id}') OR (phone = '${id}');`;

            const user = await pool.query(sql);

            if (user.rows.length > 0) {
                request.user = user;
                next();
            }
            else {
                next(new HttpException(401, 'User Not found'));
            }
        }
        catch (error) {
            let errorObj = {
                name: error.name,
                message: error.message,
                expiredAt: error.expiredAt
            }
            next(new HttpException(401, JSON.stringify(errorObj)));
        }
    }
    else {
        next(new HttpException(401, 'No token found'));
    }

}