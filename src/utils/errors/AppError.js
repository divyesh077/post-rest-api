const STATUS_ERROR_CODE_MAP = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
};

const defaultErrorCodeByStatus = (statusCode) => {
  if (statusCode >= 500) return 'INTERNAL_ERROR';
  return STATUS_ERROR_CODE_MAP[statusCode] ?? 'ERROR';
};

export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode ?? defaultErrorCodeByStatus(statusCode);
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
