import type { FastifyRequest } from 'fastify/types/request';

export function isFileUpload(req: FastifyRequest) {
  return req.headers['content-type']?.startsWith('multipart/form-data');
}
