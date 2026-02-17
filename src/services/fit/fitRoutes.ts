import { FastifyInstance } from 'fastify';
import { getFitCompatibility } from './fitCompatibilityService';

export async function fitRoutes(app: FastifyInstance) {
  app.get(
    '/fit/:itemId',
    { preHandler: [app.authenticate] },
    async (req: any) => {
      const result = await getFitCompatibility(
        req.user.userId,
        req.params.itemId
      );

      return {
        compatibility: result,
        disclaimer: 'Fit issues are non-disputable.',
      };
    }
  );
}
