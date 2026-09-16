import { successResponse } from '../../shared/http/api-response.js';
import { getHealthStatus } from '../../application/health/health.service.js';

export function getHealth(_req, res) {
  return successResponse(res, getHealthStatus());
}
