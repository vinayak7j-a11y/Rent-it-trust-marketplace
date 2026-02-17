import { FastifyInstance } from 'fastify';
import { updateItemFit } from './itemFitService';

export async function itemFitRoutes(app: FastifyInstance) {
  app.post(
    '/item/:id/fit',
    //{ preHandler: [(app as any).authenticate] },
    async (req: any) => {
      const itemId = req.params.id;
      const result = await updateItemFit(itemId, req.body);
      return { success: true, item: result };
    }
  );
}
