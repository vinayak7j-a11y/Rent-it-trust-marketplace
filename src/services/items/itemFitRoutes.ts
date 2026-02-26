import { FastifyInstance } from 'fastify';
import { updateItemFit } from './itemFitService';
import { requireRoles } from '../../middleware/roleGuard';

export async function itemFitRoutes(app: FastifyInstance) {
  app.post(
    '/item/:id/fit',
    {
      preHandler: [
        (app as any).authenticate,
        requireRoles(['owner', 'shop', 'admin']),
      ],
    },
   async (req: any) => {
  const itemId = req.params.id;

  const result = await updateItemFit(
    itemId,
    req.body,
    req.user.userId,
    req.user.role
  );

  return { success: true, item: result };
  } 
  );
}