import { FastifyInstance } from 'fastify';
import { getUserSuggestions } from './userSuggestionService';

export async function userSuggestionRoutes(app: FastifyInstance) {
  app.get(
    '/demand/suggestions',
    { preHandler: [app.authenticate] },
    async (req: any) => {
      const suggestions = await getUserSuggestions(req.user.userId);
      return { suggestions };
    }
  );
}