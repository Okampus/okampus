import { MAX_FILE_SIZE, MAX_FILES } from '@okampus/shared/consts';
import { isRequestFileData } from '@okampus/shared/utils';
import { processRequest } from 'graphql-upload-ts';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const uploadPreValidation = async (req: FastifyRequest, reply: FastifyReply) => {
  if (isRequestFileData(req) && req.url === '/graphql') {
    req.body = await processRequest(req.raw, reply.raw, { maxFileSize: MAX_FILE_SIZE, maxFiles: MAX_FILES });
  }
};
