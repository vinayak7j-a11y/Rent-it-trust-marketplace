import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { updateUserFitProfile } from './userFitService'; 

export async function userFitRoutes(app: FastifyInstance) {
  app.post(
    '/user/fit',
    { preHandler: [app.authenticate] },
    async (
      req: FastifyRequest & { user: any },
      reply: FastifyReply
    ) => {
      const result = await updateUserFitProfile(
        req.user.userId,
        req.body
      );

      return { success: true, profile: result };
    }
  );
}
