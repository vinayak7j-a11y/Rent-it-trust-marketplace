import { FastifyInstance } from 'fastify';
import { suggestItemToDemand } from './assistedSearchService';

export async function assistedSearchRoutes(app: FastifyInstance) {
  app.post(
    '/admin/demand/:id/suggest',
    { preHandler: [app.authenticate] },
    async (req: any, reply) => {
      try {
        const result = await suggestItemToDemand(
          req.params.id,
          req.body.itemId
        );

        return { success: true, suggestion: result };
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}