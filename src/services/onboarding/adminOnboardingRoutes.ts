import { FastifyInstance } from 'fastify';
import { reviewApplication } from './adminOnboardingService';

export async function adminOnboardingRoutes(app: FastifyInstance) {
  app.post(
    '/admin/applications/:id/review',
    { preHandler: [app.authenticate] },
    async (req: any) => {
      const result = await reviewApplication(
        req.params.id,
        req.user.userId,
        req.body.decision
      );

      return { success: true, result };
    }
  );
}