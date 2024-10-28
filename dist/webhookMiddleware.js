"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookMiddleware = webhookMiddleware;
function webhookMiddleware(req, res, next) {
    if (req.headers["authorization"] !== "Test") {
        res.status(401).send("Unauthorized");
        return;
    }
    next();
}
