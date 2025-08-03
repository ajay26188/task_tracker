import { NextFunction, Request, Response } from "express";
import { z } from 'zod';
import mongoose from "mongoose";
import {BSONError} from 'bson';

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
    return res.status(400).json({
      error: error.issues.map(issue => ({
        message: issue.message,
        path: issue.path,
        code: issue.code || 'invalid_input'
      }))
    });
  }

  // 2. Handle MongoDB duplicate key
  if (isMongoDuplicateKeyError(error)) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      error: [
        {
          message: `${field} already exists.`,
          path: [field],
          code: 'duplicate_key'
        }
      ]
    });
  }

  // 3. BSON error (e.g., invalid ObjectId)
  if (error instanceof BSONError) {
    return res.status(400).json({
      error: [
        {
          message: "Invalid ID format (not a valid ObjectId).",
          path: [],
          code: "invalid_id"
        }
      ]
    });
  }

  // 4. Mongoose cast error
  if (error instanceof mongoose.Error.CastError && error.kind === 'ObjectId') {
    return res.status(400).json({
      error: [
        {
          message: "Invalid ID format.",
          path: [error.path],
          code: "cast_error"
        }
      ]
    });
  }

  // 5. Mongoose validation error
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: Object.values(error.errors).map(err => ({
        message: err.message,
        path: [err.path],
        code: 'validation_error'
      }))
    });
  }

  // 6. Fallback
  return next(error);
};
