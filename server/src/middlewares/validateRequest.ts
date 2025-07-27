// /src/middlewares/validateRequest.ts

import { Request, Response, NextFunction } from "express";
import { createOrganizationSchema } from "../schemas/organization.schema";

export const newOrganizationParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        createOrganizationSchema.parse(req.body);
        next();
    } catch (error: unknown) {
        next(error);
    }
};

