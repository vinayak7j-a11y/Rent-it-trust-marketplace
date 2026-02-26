import { FastifyInstance } from 'fastify';
import { createDemand } from './demandService';

export async function demandRoutes(app: FastifyInstance) {
  app.post(
    '/demand',
    { preHandler: [app.authenticate] },
    async (req: any, reply) => {
      try {
        const result = await createDemand(req.user.userId, req.body);
        return { success: true, demand: result };
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}