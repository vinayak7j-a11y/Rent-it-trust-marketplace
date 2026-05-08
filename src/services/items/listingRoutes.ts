import { FastifyInstance } from 'fastify';
import { activateListing } from './listingService';
import { requireRoles } from '../../middleware/roleGuard';
import { prisma } from '../../infra/db/prisma';
import { ItemState } from '../../domain';

export async function listingRoutes(app: FastifyInstance) {

  // CREATE ITEM INTENT
  app.post(
    '/item/intent',
    {
      preHandler: [app.authenticate],
    },
    async (req: any, reply) => {
  try {
    const { category, gender, size, fabric, wearLevel, zone } = req.body;

    // 🔒 REQUIRED FIELDS
    if (!category || !gender || !size) {
      return reply.status(400).send({ error: "Missing required fields" });
    }

    // 🔒 ENUM VALIDATION
    const allowedGenders = ["male", "female", "unisex"];
    if (!allowedGenders.includes(gender)) {
      return reply.status(400).send({ error: "Invalid gender" });
    }

    const item = await prisma.item.create({
      data: {
        ownerId: req.user.userId,
        category,
        gender,
        size,
        fabric,
        wearLevel,
        zone,
        state: ItemState.INTENT,
      },
    });

    return { success: true, item };

  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}
  );

  // ACTIVATE LISTING
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