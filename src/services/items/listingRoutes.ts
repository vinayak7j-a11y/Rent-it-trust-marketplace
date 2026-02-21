import { FastifyInstance } from 'fastify';
import { activateListing } from './listingService';

export async function listingRoutes(app: FastifyInstance) {
  app.post(
    '/item/:id/activate',
    { preHandler: [app.authenticate] },
    async (req: any, reply) => {
      try {
        const result = await activateListing(req.params.id);
        return { success: true, item: result };
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}