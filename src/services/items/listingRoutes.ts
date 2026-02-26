import { FastifyInstance } from 'fastify';
import { activateListing } from './listingService';
import { requireRoles } from '../../middleware/roleGuard';

export async function listingRoutes(app: FastifyInstance) {
  app.post(
    '/item/:id/activate',
    {
      preHandler: [
        app.authenticate,
        requireRoles(['owner', 'shop', 'admin']),
      ],
    },
    async (req: any, reply) => {
      try {
        const result = await activateListing(
  req.params.id,
  req.user.userId,
  req.user.role
);
        return { success: true, item: result };
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}