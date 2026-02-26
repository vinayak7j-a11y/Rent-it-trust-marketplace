import { listingRoutes } from './services/items/listingRoutes';
import 'dotenv/config';
import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import { expireDemands } from './jobs/demandExpiryJob';
import { jwtConfig } from './infra/auth/jwt';
import { authRoutes } from './services/auth/authRoutes';
import { languageRoutes } from './services/auth/languageRoutes';
import { ruleRoutes } from './services/rules/ruleRoutes';
import { itemFitRoutes } from './services/items/itemFitRoutes'; 
import { onboardingRoutes } from './services/onboarding/onboardingRoutes';
import { adminOnboardingRoutes } from './services/onboarding/adminOnboardingRoutes';
import { searchRoutes } from './services/discovery/searchRoutes'; 
import { demandRoutes } from './services/demand/demandRoutes'; 
import { requireRole } from './middleware/roleGuard';
import { prisma } from './infra/db/prisma'; // make sure this import exists 

const app = Fastify();

// JWT
app.register(jwt, jwtConfig);

app.decorate(
  'authenticate',
  async function (req: any, reply: any) {
    try {
      await req.jwtVerify();

      if (req.user.status === 'banned') {
        return reply.status(403).send({ error: 'Account banned' });
      }

    } catch (err) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  }
);

// Cast to avoid TS issues
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}
// Health route
app.get('/', async () => {
  return { status: 'Rent It API running' };
});

// Route registrations
app.register(authRoutes);
app.register(languageRoutes);
app.register(ruleRoutes);
app.register(listingRoutes);
app.register(itemFitRoutes); 
app.register(onboardingRoutes);
app.register(adminOnboardingRoutes);  
app.register(searchRoutes); 
app.register(demandRoutes);
export default app;
app.post(
  '/dev/add-condition/:id',
  { preHandler: [app.authenticate, requireRole('admin')] },
  async (req: any, reply) => {

    // 🔒 Disable in production
    if (process.env.NODE_ENV === 'production') {
      return reply.status(403).send({ error: 'Disabled in production' });
    }

    try {
      const snapshot = await prisma.conditionSnapshot.create({
        data: {
          itemId: req.params.id,
          bookingId: 'dev-booking',
          photoHash: 'hash123',
          checklist: JSON.stringify(['1','2','3','4','5','6']),
          capturedBy: 'admin',
        },
      });

      return { success: true, snapshot };
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }
);
// START SERVER LAST
const start = async () => {
  try { 
    await app.listen({ port: 3000, host: '0.0.0.0' }); 
    console.log(app.printRoutes()); 
    console.log('Server running at http://localhost:3000');
  } catch (err) {
    console.error('START ERROR:', err);
    process.exit(1);
  }
}; 
setInterval(async () => {
  await expireDemands();
}, 60 * 1000); // every 1 minute
start();
