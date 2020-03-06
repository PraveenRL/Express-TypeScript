import * as jwt from 'jsonwebtoken';
import { IUser } from '../controller/user/user.model';

export interface IToken {
    token: string;
    expiresIn: number;
}

export interface IDataStoredToken {
    _id: string;
}

const Token = function createToken(user: IUser): IToken {
    // console.log(process.env.JWT_SECRET);
    const expiresIn = 60 * 60;
    const secret = 'user-token-secret';
    const dataStoredToken: IDataStoredToken = {
        _id: user._id
    };
    return {
        expiresIn,
        token: jwt.sign(dataStoredToken, secret, { expiresIn })
    }
}

export default Token;

