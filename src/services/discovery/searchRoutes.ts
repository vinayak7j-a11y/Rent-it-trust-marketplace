import { FastifyInstance } from 'fastify';
import { searchItems } from './searchService';

export async function searchRoutes(app: FastifyInstance) {
  app.get(
    '/search',
    { preHandler: [app.authenticate] },
    async (req: any, reply) => {
      const { zone, category, gender, size } = req.query;

      if (!zone) {
        return reply.status(400).send({ error: 'Zone required' });
      }

      const results = await searchItems({
        zone,
        category,
        gender,
        size,
      });

      return {
        count: results.length,
        items: results,
      };
    }
  );
}
