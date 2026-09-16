import { env } from '../config/env.js';

export const AUTH_COOKIE_NAME = 'ticket_pricing_token';

function durationToMilliseconds(duration) {
  const match = /^(\d+)(s|m|h|d)$/.exec(duration);
  if (!match) return 15 * 60 * 1000;
  const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return Number(match[1]) * units[match[2]];
}

export const authCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: durationToMilliseconds(env.JWT_EXPIRES_IN)
};

export function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);
}

export function clearAuthCookie(res) {
  const { maxAge, ...clearOptions } = authCookieOptions;
  res.clearCookie(AUTH_COOKIE_NAME, clearOptions);
}
