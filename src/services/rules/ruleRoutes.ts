import { FastifyInstance } from 'fastify';
import { prisma } from '../../infra/db/prisma';
import { loadSystemRules } from './ruleLoader';

export async function ruleRoutes(app: FastifyInstance) {
  app.get(
    '/rules/system',
    { preHandler: [(app as any).authenticate] },
    async (req: any) => {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        language: user.language,
       content: loadSystemRules(user.language as any), 
      };
    }
  );
}
