import { config } from '../../configs/config';
import type { OriginFunction } from '@fastify/cors';

export const corsValidation: OriginFunction = (origin, cb) => {
  if (config.env.isProd()) {
    return /^https:\/\/(?:[\dA-Za-z][\dA-Za-z-]{1,61}[\dA-Za-z])+\.okampus\.fr(?::\d+)?/.test(origin)
      ? cb(null, true)
      : cb(new Error('Not allowed by CORS'), false);
  }

  cb(null, true);
};
