import { NextFunction, Request, Response } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { headers } = req;
    const { authorization } = headers;

    // Validate authorization
    if (authorization) {
        next();
    } else {
        return res.status(401).send("You must be authenticated to access this resource!");
    }
};
