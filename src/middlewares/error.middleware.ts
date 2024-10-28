
// import { NextFunction, Request, Response } from "express";
// import { isAxiosError } from "axios";
// enum HttpStatus {
//     OK = 200,
//     CREATED = 201,
//     CONFLICT = 409,
//     NOT_FOUND = 404,
//     UNPROCESSABLE_ENTITY = 422,
//     BAD_REQUEST = 400,
//     INTERNAL_SERVER_ERROR = 500,
//     UNAUTHORIZED = 401,
//     FORBIDDEN = 403,
//     NO_CONTENT = 204,
//     PAYMENT_REQUIRED = 402,
//     ACCEPTED = 202,
// }

// export default function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {

//     if (isAxiosError(error)) return res.status(error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR).send(error?.response?.data);
//     const ErrorBody = createErrorBody(error);
//     if (error && typeof error === "object" && "type" in error) {
//         switch (error.type) {
//             case "Conflict":
//                 return res.status(HttpStatus.CONFLICT).send(ErrorBody);
//             case "NotFound":
//                 return res.status(HttpStatus.NOT_FOUND).send(ErrorBody);
//             case "Unprocessable":
//                 return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(ErrorBody);
//             case "Validation":
//                 return res.status(HttpStatus.BAD_REQUEST).send(ErrorBody);
//             case "Unauthorized":
//                 return res.status(HttpStatus.UNAUTHORIZED).send(ErrorBody);
//             case "Processing":
//                 return res.status(HttpStatus.NO_CONTENT).send(ErrorBody);
//             case "Internal":
//                 return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
//             case "Forbidden":
//                 return res.status(HttpStatus.FORBIDDEN).send(ErrorBody);
//             case "Critical":
//                 return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
//             case "BadRequest":
//                 return res.status(HttpStatus.BAD_REQUEST).send(ErrorBody);
//             case "PaymentRequired":
//                 return res.status(HttpStatus.PAYMENT_REQUIRED).send(ErrorBody);
//             case "Error":
//                 return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
//             default:
//                 return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
//         }
//     }

//     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
// }

// function createErrorBody(error: unknown) {
//     if (typeof error === "string") return { message: error };
//     return error;
// }