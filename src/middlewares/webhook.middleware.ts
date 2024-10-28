import { NextFunction, Request, Response } from "express";

export function webhookMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.headers["authorization"] !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
        res.status(401).send("Unauthorized");
        return;
    }
    next();
}