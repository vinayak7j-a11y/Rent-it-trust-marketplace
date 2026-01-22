import { FastifyRequest, FastifyReply } from 'fastify';
import { UserStatus } from '../domain/enums';

/**
 * Blocks users based on account status.
 * This middleware must be applied to all protected routes.
 */
export async function enforceUserStatus(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;

  // Not authenticated
  if (!user) {
    return reply.status(401).send({
      error: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  // Permanently blocked
  if (user.status === UserStatus.BANNED) {
    return reply.status(403).send({
      error: 'USER_BANNED',
      message: 'Your account has been banned',
    });
  }

  // Temporarily restricted
  if (user.status === UserStatus.LIMITED) {
    return reply.status(403).send({
      error: 'USER_LIMITED',
      message: 'Your account access is currently limited',
    });
  }
}
