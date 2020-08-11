# Run the application
- npm start
- npm run start-dev

# Start
- npm init
- Install packages
```
npm i @types/bcryptjs @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/node @types/pg @types/redis bcryptjs body-parser class-transformer class-validator cookie-parser cors dotenv envalid express jsonwebtoken pg redis ts-node typescript --save
```
- Create .gitignore
```
/node_modules
/dist
```

# Create tsconfig.json
```
{
    "compilerOptions": {
        "sourceMap": true,
        "outDir": "./dist",
        "baseUrl": "./src",
        "moduleResolution": "node",
        "strict": false,
        "alwaysStrict": true,
        "strictNullChecks": true,
        "strictPropertyInitialization": false,
        "experimentalDecorators": true,
        "target": "es2017",
        "lib": [
            "ES2017"
        ]
    },
    "include": [
        "src/**/*.ts"
    ],
    "exclude": [
        "node_modules"
    ]
}
```

# Create src/utils/nodemon.json
```
{
    "watch": ["src"],
    "ext": "ts",
    "ignore": ["src/public"],
    "exec": "ts-node src/server.ts"
}
```

# CREATE .env
```
PORT=3000
JWT_SECRET=jwt_secret
DB_USER=postgres
DB_PASSWORD=postgres1
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=saans
REDIS_PORT=6379
REDIS_HOST=127.0.0.1
REDIS_DB=0
REDIS_PASSWORD=foobared
```

# Create config/database.ts
```
import { Pool } from "pg";
const redis = require('redis');

export function poolFunction() {

    const isProduction = process.env.NODE_ENV === 'production';

    const devPool = {
        user: `${process.env.DB_USER}`,
        host: `${process.env.DB_HOST}`,
        database: `${process.env.DB_DATABASE}`,
        password: `${process.env.DB_PASSWORD}`,
        port: parseInt(`${process.env.DB_PORT}`)
    }

    const devPoolString =
        `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

    let connectionPool = isProduction ? process.env.DATABASE_URL : devPoolString;

    return new Pool({
        connectionString: connectionPool
        // ssl: {
        //     rejectUnauthorized: false
        // }
    });

}

export function redisFunction() {
    const isProduction = process.env.NODE_ENV === 'production';

    const local = {
        port: `${process.env.REDIS_PORT}`,
        host: `${process.env.REDIS_HOST}`,
        db: `${process.env.REDIS_DB}`
    }

    const production = {
        port: `${process.env.REDIS_PORT}`,
        host: `${process.env.REDIS_HOST}`,
        db: `${process.env.REDIS_DB}`,
        password: `${process.env.REDIS_PASSWORD}`
    }

    let client = isProduction ? production : local;
    console.log(client);

    return redis.createClient(client);
}
```

# Create following folders inside _src_ folder:
- controllers
- exceptions
- interfaces
- middlewares
- services
- utils
- validators
## And create these two files:
- app.ts
- server.ts

# Create src\interfaces\controller.interface.ts
```
import { Router } from "express";

export interface IController{
    path: string;
    router: Router;
}
```

# Create src\middlewares\error.middleware.ts
```
import { Request, Response, NextFunction } from "express";

import { HttpException } from "../exceptions/http.exception";

export function ErrorMiddleware(
    error: HttpException,
    request: Request,
    response: Response,
    next: NextFunction
) {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    response.status(status).send(message);
}
```

# Create src\exceptions\http.exception.ts
```
export class HttpException extends Error {
    status: number;
    message: string;
    constructor(
        status: number,
        message: string
    ) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
```

# Add the following in app.ts
```
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
```

# Add the following in server.ts
```
import { App } from "./app";

import { AuthenticationController } from "./controllers/authentication.controller";

import { config } from "dotenv";
import { validateEnv } from "./utils/validateEnv";

config();
validateEnv();

const app = new App(
    [
        new AuthenticationController()
    ]
);

app.listen();
```

# Create src\utils\validateEnv.ts
```
import { cleanEnv, port, str, host, num } from "envalid";

export function validateEnv() {
    cleanEnv(process.env, {
        PORT: port(),
        JWT_SECRET: str(),
        DB_USER: str(),
        DB_PASSWORD: str(),
        DB_HOST: host(),
        DB_PORT: port(),
        DB_DATABASE: str(),
        REDIS_PORT: port(),
        REDIS_HOST: host(),
        REDIS_DB: num(),
        REDIS_PASSWORD: str()
    })
}
```

# Create src\controllers\authentication.controller.ts
```
import { Router, Request, Response, NextFunction } from "express";

import { IController } from "../interfaces/controller.interface";
import { AuthenticationService } from "../services/authentication.service";
import { validationMiddleWare } from "../middlewares/validation.middleware";
import { CreateUserDTO } from "../validators/create-user.dto";
import { LoginDTO } from "../validators/login.dto";
import { ICreateUser, RequestWithUser } from "../interfaces/create-user.interface";
import { HttpException } from "../exceptions/http.exception";
import { authMiddleware } from "../middlewares/auth.middleware";
import { IRefreshToken } from "../interfaces/token.interface";

export class AuthenticationController implements IController {
    public path: string = "";
    public router = Router();
    public authenticationService = new AuthenticationService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleWare(CreateUserDTO, false), this.register);
        this.router.post(`${this.path}/login`, validationMiddleWare(LoginDTO, false), this.login);
        this.router.get(`${this.path}/logout`, this.logout);
        this.router.post(`${this.path}/getRefreshToken`, authMiddleware, this.getRefreshToken);
    }

    private register = async (request: Request, response: Response, next: NextFunction) => {
        const requestBody: ICreateUser = request.body;

        try {
            const result: any = await this.authenticationService.registerFromService(requestBody);

            return response.status(201).send(result);
        }
        catch (error) {
            next(new HttpException(400, error));
        }
    }

    private login = async (request: Request, response: Response, next: NextFunction) => {
        const requestBody: LoginDTO = request.body;

        try {
            const result: any = await this.authenticationService.loginFromService(requestBody);

            if (result.tokens) {
                return response.status(200).send(result);
            }
            else {
                next(new HttpException(404, JSON.stringify(result)));
            }

        }
        catch (error) {
            next(new HttpException(404, error));
        }
    }

    private logout = async (request: Request, response: Response, next: NextFunction) => {
        response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        response.status(200).send('Logged out');
    }

    private getRefreshToken = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            let user = request.user.rows[0];
            let refreshTokenEmail: IRefreshToken = {
                email: user.email,
                refreshToken: request.body.refreshToken
            }

            if (user) {
                let tokens = this.authenticationService.refreshTokenFromService(refreshTokenEmail);
                return response.status(200).send(tokens);
            }
            else {
                return response.status(401).send(false);
            }

        }
        catch (error) {
            next(new HttpException(401, error));
        }
    }

}
```

# Create src\services\authentication.service.ts
```
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
                    return new HttpException(404, 'Invalid Password');
                }
            }

            else {
                return new HttpException(404, 'Invalid Username');
            }
        }
        catch (error) {
            throw error;
        }
    }

    public createToken(userId: string) {
        const expiresIn = 60;
        // const expiresIn = 60 * 60;
        const secret = '' + process.env.JWT_SECRET;
        const dataStoredInToken: IDataStoredToken = {
            _id: userId
        }

        let refreshRandomToken = Math.random()
        this.refreshTokenObject[refreshRandomToken] = userId;
        console.log(this.refreshTokenObject);

        return {
            expiresIn,
            accessToken: jwt.sign(dataStoredInToken, secret, { expiresIn }),
            refreshToken: refreshRandomToken
        }
    }

    public refreshTokenFromService(refreshTokenEmail: IRefreshToken) {
        if (refreshTokenEmail.refreshToken in this.refreshTokenObject) {
            let tokens = this.createToken(refreshTokenEmail.email);
            delete this.refreshTokenObject[refreshTokenEmail.refreshToken];
            return tokens;
        }
    }

}
```

# Create src\interfaces\create-user.interface.ts
```
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
```

# Create src\interfaces\token.interface.ts
```
export interface IToken {
    token: string;
    expiresIn: number;
}

export interface IDataStoredToken {
    _id: string;
}

export interface IRefreshToken{
    refreshToken: string;
    email: string;
}
```

# Create src\middlewares\validation.middleware.ts
```
import { RequestHandler } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from 'class-transformer';

import { HttpException } from "../exceptions/http.exception";

export function validationMiddleWare<T>(type: any, skipMissingProperties: boolean): RequestHandler {

  return (request, response, next) => {
    validate(plainToClass(type, request.body), { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          let message = errors.map((error: any) =>
            Object.values(error.constraints)).join(', ');

          next(new HttpException(400, message));
        } else {
          next();
        }
      })
  }

}
```

# Create src\validators\create-user.dto.ts
```
import { IsString, IsNotEmpty, IsNumber, IsEmail } from "class-validator";

export class CreateUserDTO{

    @IsString()
    @IsNotEmpty()
    public first_name: string;

    @IsString()
    @IsNotEmpty()
    public last_name: string;

    @IsNumber()
    @IsNotEmpty()
    public age: number;

    @IsString()
    @IsNotEmpty()
    public gender: string;

    @IsString()
    @IsNotEmpty()
    public phone: string;

    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public address: string;

    @IsString()
    @IsNotEmpty()
    public password_hashed: string;

}
```

# Create src\validators\login.dto.ts
```
import { IsString, IsNotEmpty } from "class-validator";

export class LoginDTO {

    @IsNotEmpty()
    @IsString()
    public userName: string;

    @IsNotEmpty()
    @IsString()
    public password: string;

}
```

# Create src\middlewares\auth.middleware.ts
```
import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

import { poolFunction } from "../../config/database";
import { HttpException } from "../exceptions/http.exception";
import { IDataStoredToken } from "../interfaces/token.interface";
import { RequestWithUser } from "../interfaces/create-user.interface";

export async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {

    const token = '' + request.headers.Access_Token;
    let pool = poolFunction();

    if (token) {
        const secret: string = '' + process.env.JWT_SECRET;

        try {
            const verificationRespone = jwt.verify(token, secret) as IDataStoredToken;
            const id = verificationRespone._id;
            let sql: string = `SELECT * FROM admin_user WHERE 
            (email = '${id}') OR (phone = '${id}');`;

            const user = await pool.query(sql);

            if (user.rows.length > 0) {
                request.user = user;
                next();
            }
            else {
                next(new HttpException(404, "User Not found"));
            }
        }
        catch (error) {
            next(new HttpException(404, error));
        }
    }
    else {
        next(new HttpException(404, "No token found"));
    }
}
```