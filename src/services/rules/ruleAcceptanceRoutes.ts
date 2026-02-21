import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function ruleAcceptanceRoutes(app: FastifyInstance) {
  app.post(
    '/rules/accept',
    { preHandler: [app.authenticate] },
    async (req: any, reply) => {
      const { version } = req.body;

      if (!version) {
        return reply.status(400).send({ error: 'Version required' });
      }

      await prisma.userRuleAcceptance.create({
        data: {
          userId: req.user.userId,
          ruleVersionId: version,
        },
      });

      return { success: true };
    }
  );
}