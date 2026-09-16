import { AppError } from '../../shared/errors/app-error.js';
import { errorResponse } from '../../shared/http/api-response.js';

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const normalized = error instanceof AppError
    ? error
    : new AppError('An unexpected error occurred.', 500, 'INTERNAL_ERROR');

  if (normalized.statusCode >= 500 && process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return errorResponse(res, normalized, normalized.statusCode);
}
