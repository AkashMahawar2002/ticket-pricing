import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

const JWT_ALGORITHM = 'HS256';

export function createAccessToken(userId) {
  return jwt.sign(
    { sub: userId.toString(), tokenType: 'access' },
    env.JWT_SECRET,
    {
      algorithm: JWT_ALGORITHM,
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE
    }
  );
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, env.JWT_SECRET, {
    algorithms: [JWT_ALGORITHM],
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE
  });

  if (!payload || typeof payload !== 'object' || payload.tokenType !== 'access' || typeof payload.sub !== 'string' || !payload.sub) {
    throw new Error('Invalid access token claims');
  }

  return { userId: payload.sub };
}
