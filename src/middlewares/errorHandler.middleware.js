import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    message: message,
    errorCode: err.errorCode,
  };

  if (env.nodeEnv !== 'production') {
    response.error = {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }
  res.status(statusCode).json(response);
};
