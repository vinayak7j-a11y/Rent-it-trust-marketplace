import { FastifyInstance } from 'fastify';
import { createBooking } from './bookingService';

export async function bookingRoutes(app: FastifyInstance) {
  app.post(
    '/booking',
    { preHandler: [app.authenticate] },
    async (req: any, reply) => {
      try {
        const { itemId, startDate, endDate } = req.body;

        const booking = await createBooking(
          req.user.userId,
          itemId,
          new Date(startDate),
          new Date(endDate)
        );

        return { success: true, booking };
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}