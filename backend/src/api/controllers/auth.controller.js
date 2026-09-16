import { successResponse } from '../../shared/http/api-response.js';
import { createAuthService } from '../../application/auth/auth.service.js';
import { clearAuthCookie, setAuthCookie } from '../auth-cookie.js';
import { toPublicUser } from '../../domain/auth/user-dto.js';

const authService = createAuthService();

export async function signup(req, res) {
  const result = await authService.signup(req.body);
  setAuthCookie(res, result.accessToken);
  return successResponse(res, { user: result.user }, 201);
}

export async function login(req, res) {
  const result = await authService.login(req.body);
  setAuthCookie(res, result.accessToken);
  return successResponse(res, { user: result.user });
}

export function logout(_req, res) {
  clearAuthCookie(res);
  return successResponse(res, { message: 'Logged out successfully.' });
}

export async function me(req, res) {
  return successResponse(res, { user: toPublicUser(req.auth.user) });
}
