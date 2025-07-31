import { NextFunction, Request, Response } from "express";
import { z } from 'zod';
import mongoose from "mongoose";

interface MongoDuplicateKeyError {
  name: string;
  code: number;
  keyValue: Record<string, string>;
}

function isMongoDuplicateKeyError(error: unknown): error is MongoDuplicateKeyError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    'code' in error &&
    'keyValue' in error &&
    (error as Record<string, unknown>).name === 'MongoServerError' &&
    (error as Record<string, unknown>).code === 11000
  );
}

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Handle Zod validation errors
  if (error instanceof z.ZodError) {
    return res.status(400).send({ error: error.issues });
  }

  // 2. Handle Mongoose duplicate key error
  if (isMongoDuplicateKeyError(error)) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({ error: `${field} already exists.` });
  }

  // 3. Handle invalid ObjectId
  if (error instanceof mongoose.Error.CastError && error.kind === 'ObjectId') {
    return res.status(400).json({ error: "Invalid ID format." });
  }

  // 4. Handle Mongoose validation error
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.errors,
    });
  }

  // 5. Fallback: unknown/unexpected error
  return next(error);
};
