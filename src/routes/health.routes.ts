import { Router } from "express";

const healthRouter = Router();

healthRouter.all('/health', (req, res) => {
    res.status(200).send('OK');
});

export { healthRouter };