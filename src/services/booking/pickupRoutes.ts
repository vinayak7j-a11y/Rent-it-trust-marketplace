import { FastifyInstance } from 'fastify';
import { pickupBooking } from './pickupService';

export async function pickupRoutes(app: FastifyInstance) {
  app.post(
    '/booking/:id/pickup',
    { preHandler: [app.authenticate] },
    async (req: any, reply) => {
      try {
        const result = await pickupBooking(
          req.params.id,
          req.body.photoUrls,
          req.body.capturedBy
        );

        return result;
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}