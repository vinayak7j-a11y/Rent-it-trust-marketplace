import { FastifyInstance } from 'fastify';
import { returnBooking } from './returnService';

export async function returnRoutes(app: FastifyInstance) {
  app.post(
    '/booking/:id/return',
    { preHandler: [app.authenticate] },
    async (req: any, reply) => {
      try {
        const result = await returnBooking(
          req.params.id,
          req.body.photoUrls,
          req.body.damageType,
          req.body.capturedBy
        );

        return result;
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}