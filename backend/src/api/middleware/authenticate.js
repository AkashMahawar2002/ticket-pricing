import { AppError } from '../../shared/errors/app-error.js';
import { AUTH_COOKIE_NAME } from '../auth-cookie.js';
import { verifyAccessToken } from '../../infrastructure/security/jwt-token-service.js';
import { createUserRepository } from '../../infrastructure/database/repositories/user.repository.js';

export function createAuthenticate({ tokenService = { verifyAccessToken }, userRepository = createUserRepository() } = {}) {
  return async (req, _res, next) => {
    const token = req.cookies?.[AUTH_COOKIE_NAME];
    if (!token) return next(new AppError('Authentication is required.', 401, 'AUTH_REQUIRED'));

    try {
      const { userId } = tokenService.verifyAccessToken(token);
      const user = await userRepository.findById(userId);
      if (!user) return next(new AppError('Authentication is required.', 401, 'AUTH_REQUIRED'));
      req.auth = { userId: user._id.toString(), user };
      return next();
    } catch (error) {
      if (error instanceof AppError) return next(error);
      return next(new AppError('Authentication token is invalid or expired.', 401, 'INVALID_TOKEN'));
    }
  };
}

export const authenticate = createAuthenticate();
