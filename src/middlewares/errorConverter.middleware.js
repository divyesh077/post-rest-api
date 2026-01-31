import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

import { AppError } from '../utils/errors/AppError.js';

export const errorConverter = (err, req, res, next) => {
  // if already standardized, forward as is
  if (err instanceof AppError) {
    return next(err);
  }

  let statusCode = err?.statusCode ?? 500;
  let message = err?.message ?? 'Internal server error';

  // 1. Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
  }

  // 2. Mongoose bad ObjectiD
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid resource id';
  }

  // 3. Mongoose validation error
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // 4. Mngoose duplication key(
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    statusCode = 400;
    message = `${field} already exists`;
  }

  // 5. JWT errors
  else if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = 'Invalid or expired token';
  }
  // 6. Syntax error in JOSN body
  else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON request body';
  }

  const error = new AppError(message, statusCode);
  next(error);
};
