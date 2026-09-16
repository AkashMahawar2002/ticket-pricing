import { AppError } from '../../shared/errors/app-error.js';

export function validateBody(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new AppError('Request validation failed.', 400, 'VALIDATION_ERROR', result.error.flatten().fieldErrors));
    }
    req.body = result.data;
    next();
  };
}
