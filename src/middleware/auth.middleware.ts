import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import RequestWithUser from '../interfaces/requestWithUser.interface';
import UserModel from '../controller/user/user.model';
import { IDataStoredToken } from '../helper/token';
import HttpException from '../exceptions/http.exceptions';

async function authMiddleWare(request: RequestWithUser, response: Response, next: NextFunction) {
    const cookies = request.cookies;
    if (cookies && cookies.Authorization) {
        const secret = "user-token-secret";
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as IDataStoredToken;
            const id = verificationResponse._id;
            const user = await UserModel.findById(id);
            if (user) {
                request.user = user;
                next();
            } else {
                next(new HttpException(404, "User Not Found"));
            }
        }
        catch (error) {
            next(new HttpException(404, error))
        }
    } else {
        next(new HttpException(404, "No token found"))
    }
}

export default authMiddleWare;