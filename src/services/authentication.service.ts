import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { poolFunction } from '../../config/database';
import { ICreateUser, ILogin } from "../interfaces/create-user.interface";
import { IDataStoredToken, IRefreshToken } from '../interfaces/token.interface';
import { HttpException } from '../exceptions/http.exception';

export class AuthenticationService {

    public refreshTokenObject = {};

    public async registerFromService(requestBody: ICreateUser) {
        let pool = poolFunction();
        const hashedPassword: string = await bcrypt.hash(requestBody.password_hashed, 10);

        const sql = `INSERT INTO admin_user (
            first_name, last_name, age, gender, phone, email, address, password_hashed
        )
        VALUES (
            '${requestBody.first_name}', '${requestBody.last_name}', ${requestBody.age},
            '${requestBody.gender}', '${requestBody.phone}', '${requestBody.email}',
            '${requestBody.address}', '${hashedPassword}'
        ) RETURNING email;`;

        try {
            let result = await pool.query(sql);

            if (result.rowCount == 1) {

                let tokenData = this.createToken(result.rows[0].email);

                return {
                    tokens: tokenData,
                    user: result.rows[0]
                };

            } else {
                return new HttpException(400, "Could not create user");
            }
        }
        catch (error) {
            throw error;
        }

    }

    public async loginFromService(requestBody: ILogin) {
        let pool = poolFunction();
        let sql = `SELECT * FROM admin_user WHERE 
        (email = '${requestBody.userName}') OR (phone = '${requestBody.userName}');`;

        try {
            const result = await pool.query(sql);
            if (result.rows.length > 0) {
                let isPasswordMatching = await bcrypt.compare(requestBody.password, result.rows[0].password_hashed);

                if (isPasswordMatching) {
                    let tokenData = this.createToken(result.rows[0].email);

                    let response: Object = {
                        email: result.rows[0].email,
                        userId: result.rows[0].user_id
                    }

                    return {
                        tokens: tokenData,
                        user: response
                    };
                }
                else {
                    return new HttpException(401, 'Invalid Password');
                }
            }

            else {
                return new HttpException(401, 'Invalid Username');
            }
        }
        catch (error) {
            throw error;
        }
    }

    public createToken(userId: string) {
        const expiresIn = 60 * 60;
        const secret = '' + process.env.JWT_SECRET;
        const dataStoredInToken: IDataStoredToken = {
            _id: userId
        }

        let refreshRandomToken = Math.random();
        this.refreshTokenObject[refreshRandomToken] = userId;

        return {
            expiresIn,
            accessToken: jwt.sign(dataStoredInToken, secret, { expiresIn }),
            refreshToken: refreshRandomToken
        }
    }

    public refreshTokenFromService(refreshToken: IRefreshToken) {
        if (refreshToken.refreshToken in this.refreshTokenObject) {

            let tokens = this.createToken(this.refreshTokenObject[refreshToken.refreshToken]);
            delete this.refreshTokenObject[refreshToken.refreshToken];
            return tokens;
        }
        else {
            throw new HttpException(401, 'Refresh Token Not Found');
        }
    }

    public logoutFromService(refreshToken: IRefreshToken) {
        if (refreshToken.refreshToken in this.refreshTokenObject) {
            delete this.refreshTokenObject[refreshToken.refreshToken];
            return true;
        }
        else {
            throw new HttpException(401, 'You are not logged in');;
        }
    }

}