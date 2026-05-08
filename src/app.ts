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
import { requireRoles } from './middleware/roleGuard';
import { prisma } from './infra/db/prisma';
import { FastifyRequest, FastifyReply } from 'fastify';

const app = Fastify();

// ✅ PARAM TYPE
type AddConditionParams = {
  id: string;
};

// ✅ JWT USER TYPE (IMPORTANT)
type JwtUser = {
  id: string;
  role: string;
  status: string;
};

// JWT
app.register(jwt, jwtConfig);

app.decorate(
  'authenticate',
  async function (req: any, reply: any) {
    try {
      await req.jwtVerify();

      const user = req.user as JwtUser;

      if (user.status === 'banned') {
        return reply.status(403).send({ error: 'Account banned' });
      }

    } catch (err) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  }
);

// ✅ ONLY keep this (DO NOT override user)
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}

// Health route
app.get('/', async () => {
  return { status: 'Rent It API running' };
});

// Routes
app.register(authRoutes);
app.register(languageRoutes);
app.register(ruleRoutes);
app.register(listingRoutes);
app.register(itemFitRoutes);
app.register(onboardingRoutes);
app.register(adminOnboardingRoutes);
app.register(searchRoutes);
app.register(demandRoutes);

// ✅ FIXED ROUTE 
// =========================================
// DEV ONLY ROUTE
// Simulates item verification before
// verifier/shop workflow is implemented.
// NOT intended for production usage.
// =========================================
app.post(
  '/dev/add-condition/:id',
  {
    preHandler: [app.authenticate, requireRoles(['admin', 'shop', 'agent'])],
  },
  async (
    req: FastifyRequest<{ Params: AddConditionParams }>,
    reply: FastifyReply
  ) => {

    const user = req.user as JwtUser;

    if (process.env.NODE_ENV === 'production') {
      return reply.status(403).send({ error: 'Disabled in production' });
    }

    // 🚨 Prevent double verification
    const existing = await prisma.conditionSnapshot.findFirst({
      where: { itemId: req.params.id },
    });

    if (existing) {
      return reply.status(400).send({ error: 'Already verified' });
    }

    try {
      const snapshot = await prisma.conditionSnapshot.create({
        data: {
          itemId: req.params.id,
          bookingId: 'dev-booking', 
          type: "initial", 
          photoHash: 'hash123',
          checklist: JSON.stringify(['1','2','3','4','5','6']),
          capturedBy: user.role,
        },
      });

      return { success: true, snapshot };
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }
);

export default app;

// START SERVER
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
}, 60 * 1000);

start();