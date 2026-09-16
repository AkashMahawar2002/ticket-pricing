import mongoose from 'mongoose';
import { AppError } from '../../shared/errors/app-error.js';
import { normalizeEmail } from '../../domain/auth/email.js';
import { toPublicUser } from '../../domain/auth/user-dto.js';
import { hashPassword, verifyPassword } from '../../domain/auth/password-hasher.js';
import { createAccessToken } from '../../infrastructure/security/jwt-token-service.js';
import { createUserRepository } from '../../infrastructure/database/repositories/user.repository.js';

const INVALID_CREDENTIALS = new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');

function isDuplicateEmailError(error) {
  return error?.code === 11000 && Boolean(error?.keyPattern?.normalizedEmail || error?.keyValue?.normalizedEmail);
}

export function createAuthService({ userRepository = createUserRepository(), password = { hashPassword, verifyPassword }, token = { createAccessToken } } = {}) {
  return {
    async signup({ name, email, password: rawPassword }) {
      const normalizedEmail = normalizeEmail(email);
      const existing = await userRepository.findByNormalizedEmail(normalizedEmail);
      if (existing) throw new AppError('An account with this email already exists.', 409, 'EMAIL_ALREADY_EXISTS');

      try {
        const user = await userRepository.create({
          name: name.trim(),
          email: email.trim(),
          normalizedEmail,
          passwordHash: await password.hashPassword(rawPassword),
          membershipStatus: 'NONE'
        });
        return { user: toPublicUser(user), accessToken: token.createAccessToken(user._id) };
      } catch (error) {
        if (isDuplicateEmailError(error)) {
          throw new AppError('An account with this email already exists.', 409, 'EMAIL_ALREADY_EXISTS');
        }
        throw error;
      }
    },

    async login({ email, password: rawPassword }) {
      const normalizedEmail = normalizeEmail(email);
      const user = await userRepository.findByNormalizedEmail(normalizedEmail, { includePasswordHash: true });
      if (!user || !user.passwordHash) throw INVALID_CREDENTIALS;

      const validPassword = await password.verifyPassword(user.passwordHash, rawPassword);
      if (!validPassword) throw INVALID_CREDENTIALS;
      return { user: toPublicUser(user), accessToken: token.createAccessToken(user._id) };
    },

    async getCurrentUser(userId) {
      if (!mongoose.isValidObjectId(userId)) throw new AppError('Authentication is required.', 401, 'AUTH_REQUIRED');
      const user = await userRepository.findById(userId);
      if (!user) throw new AppError('Authentication is required.', 401, 'AUTH_REQUIRED');
      return { user: toPublicUser(user) };
    }
  };
}
