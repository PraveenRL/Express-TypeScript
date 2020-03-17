import { Request, Response, NextFunction } from 'express';

import HttpException from "../exception/http.exception";

function ErrorMiddleWare(error: HttpException, request: Request, response: Response, next: NextFunction) {
    const status = error.status || 5000;
    const message = error.message || "Something went wrong";
    response.status(status).send({ status, message });
}

export default ErrorMiddleWare;