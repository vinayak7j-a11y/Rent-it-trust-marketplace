import { FastifyInstance } from 'fastify';
import { submitApplication } from './onboardingService';

export async function onboardingRoutes(app: FastifyInstance) {
  app.post(
    '/apply',
    { preHandler: [app.authenticate] },
    async (req: any) => {
      const result = await submitApplication(
        req.user.userId,
        req.body
      );

      return { success: true, application: result };
    }
  );
}