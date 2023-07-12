import type { FastifyRequest, FastifyReply } from 'fastify';

export type GQLContext = { req: FastifyRequest; reply: FastifyReply };
