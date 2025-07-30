import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { SECRET } from "../config/env";
import User from "../models/user";
import { IUser } from "../types/user";
import { Document } from "mongoose";

export interface Token extends Request {
    token?: string | null,
    user?: (IUser & Document) | null
};

interface DecodedToken {
    id: string,
    role: string,
    organizationId: string
};

export const tokenExtractor = (req: Token, _res: Response, next: NextFunction) => {
    const authorization = req.get('authorization');

    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '');
    } else {
        req.token = null;
    }
    next();
};

export const adminStatus = (req: Token, res: Response, next: NextFunction) => {
    const token = req.token;

    if (!token) {
        return res.status(401).json({error:'token missing.' })
    }

    const decoded = jwt.verify(token, SECRET); 

    if (typeof decoded !== 'object' || decoded === null || !('role' in decoded)) {
        return res.status(401).json({error: 'Invalid token.'})
    }

    const decodedToken = decoded as DecodedToken; // type guard

    if (decodedToken.role !== 'admin') {
        return res.status(401).json({error: 'Unauthorized to perform this operation.'});
    }
    return next(); //returns to routeHandler if the user is admin
};

export const userExtractor = async( req: Token, res: Response, next: NextFunction) => {
    const token = req.token;

    if (!token) {
        return res.status(401).json({error:'token missing.' })
    }

    const decoded = jwt.verify(token, SECRET); 

    if (typeof decoded !== 'object' || decoded === null || !('id' in decoded)) {
        return res.status(401).json({error: 'Invalid token.'})
    }

    const decodedToken = decoded as DecodedToken; // type guard

    try {
        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({error: 'User not found.'})
        }

        req.user = user;
        return next();

    } catch (err) {
        return next(err);
    }
};