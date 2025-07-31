// /middlewares/errorHandler.ts

import { Request, Response } from "express";
import { z } from 'zod';
import mongoose from "mongoose";

function isMongoDuplicateKeyError(error: any): error is { code: number; keyValue: Record<string, string> } {
    return error?.name === 'MongoServerError' && error?.code === 11000;
};

export const errorHandler = (error: unknown, _req: Request, res: Response) => {
    // 1. Handle Zod validation errors (from request validation)
    if (error instanceof z.ZodError) {
        return res.status(400).send({ error: error.issues});
    } 

    // 2. Handle Mongoose duplicate key error (e.g. email, username uniqueness)
    if (isMongoDuplicateKeyError(error)) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({ error: `${field} already exists.` });
    }

    //3. Handle invalid ObjectId (e.g., /users/123)
    if (error instanceof mongoose.Error.CastError && error.kind === 'ObjectId') {
        return res.status(400).json({ error: "Invalid ID format." });
    }
    
    // 4. Handle general Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
    }

    // 5. Fallback: Unknown/unexpected error
    return res.status(500).json({ error: "Internal server error." });
};