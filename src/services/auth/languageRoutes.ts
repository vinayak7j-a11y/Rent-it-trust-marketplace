import { FastifyInstance } from 'fastify';
import { prisma } from '../../infra/db/prisma';
import { Language } from '../../domain';

export async function languageRoutes(app: FastifyInstance) {
  app.post(
    '/user/language',
    { preHandler: [(app as any).authenticate] }, 
    async (req: any, reply) => {
      const { language } = req.body as { language: Language };

      if (!Object.values(Language).includes(language)) {
        return reply.status(400).send({ error: 'Invalid language' });
      }

      await prisma.user.update({
        where: { id: req.user.userId },
        data: { language },
      });

      return { success: true };
    }
  );
}
