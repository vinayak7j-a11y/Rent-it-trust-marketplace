import { FastifyInstance } from 'fastify';
import { finalizeBooking } from './payoutService';

export async function payoutRoutes(app: FastifyInstance) {
  app.post(
    '/booking/:id/close',
    { preHandler: [app.authenticate] },
    async (req: any, reply) => {
      try {
        const result = await finalizeBooking(req.params.id);
        return result;
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}