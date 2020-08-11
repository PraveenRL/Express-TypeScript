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