
import { NextFunction, Request, Response } from "express";
enum HttpStatus {
    OK = 200,
    CREATED = 201,
    CONFLICT = 409,
    NOT_FOUND = 404,
    UNPROCESSABLE_ENTITY = 422,
    BAD_REQUEST = 400,
    INTERNAL_SERVER_ERROR = 500,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NO_CONTENT = 204,
    PAYMENT_REQUIRED = 402,
    ACCEPTED = 202,
}

export default function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
}