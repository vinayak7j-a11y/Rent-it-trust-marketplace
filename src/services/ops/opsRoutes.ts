import { FastifyInstance } from 'fastify';
import { getOpsMetrics } from './opsMetricsService';
import { detectAbuseSignals } from './abuseSignalService';
import { getZoneActivity } from './zoneHealthService';

export async function opsRoutes(app: FastifyInstance) {

  app.get('/admin/ops', async () => {

    const metrics = await getOpsMetrics();
    const abuse = await detectAbuseSignals();
    const zones = await getZoneActivity();

    return {
      metrics,
      abuseSignals: abuse,
      zones
    };

  });

}