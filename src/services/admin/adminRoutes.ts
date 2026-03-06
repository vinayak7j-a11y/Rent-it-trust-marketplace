import { FastifyInstance } from 'fastify';
import { getPendingBookings } from './adminBookingService';
import { getActiveDemands } from './adminDemandService';
import { getPendingItems } from './adminSupplyService';
import { overrideTrust } from './adminTrustService';

export async function adminRoutes(app: FastifyInstance) {

  app.get('/admin/bookings', async () => {
    return getPendingBookings();
  });

  app.get('/admin/demands', async () => {
    return getActiveDemands();
  });

  app.get('/admin/items', async () => {
    return getPendingItems();
  });

  app.post('/admin/trust', async (req: any) => {

    const { userId, newScore } = req.body;

    return overrideTrust(
      req.user.userId,
      userId,
      newScore
    );

  });

}