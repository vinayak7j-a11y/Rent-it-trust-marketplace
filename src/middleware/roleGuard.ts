import { FastifyReply, FastifyRequest } from 'fastify';

export function requireRole(role: string) {
  return async function (req: any, reply: FastifyReply) {
    if (!req.user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    if (req.user.role !== role) {
      return reply.status(403).send({ error: 'Forbidden' });
    }
  };
}

export function requireRoles(roles: string[]) {
  return async function (req: any, reply: FastifyReply) {
    if (!req.user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return reply.status(403).send({ error: 'Forbidden' });
    }
  };
}