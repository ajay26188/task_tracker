// /src/middlewares/validateRequest.ts

import { Request, Response, NextFunction } from "express";
import { createOrganizationSchema } from "../schemas/organization";
import { createUserSchema } from "../schemas/user";
import { loginSchema } from "../schemas/login";
import { createProjectSchema } from "../schemas/project";

export const newOrganizationParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        createOrganizationSchema.parse(req.body);
        next();
    } catch (error: unknown) {
        next(error);
    }
};

export const newUserParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        createUserSchema.parse(req.body);
        next();
    } catch (error: unknown) {
        next(error);
    }
};

export const loginParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        loginSchema.parse(req.body);
        next();
    } catch (err) {
        next(err);
    }
};

export const newProjectParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        createProjectSchema.parse(req.body);
        next();
    } catch (err) {
        next(err);
    }
};




