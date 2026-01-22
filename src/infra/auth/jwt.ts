import { FastifyJWTOptions } from '@fastify/jwt';

export const jwtConfig: FastifyJWTOptions = {
  secret: process.env.JWT_SECRET || 'dev-secret',
};

