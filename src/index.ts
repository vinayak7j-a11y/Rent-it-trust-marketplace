import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { jwtConfig } from './infra/auth/jwt';

// Route imports
import { authRoutes } from './services/auth/authRoutes';
import { languageRoutes } from './services/auth/languageRoutes';
import { ruleRoutes } from './services/rules/ruleRoutes';
import { ruleAcceptanceRoutes } from './services/rules/ruleAcceptanceRoutes';
import { userFitRoutes } from './services/users/userFitRoutes';
import { itemFitRoutes } from './services/items/itemFitRoutes';
import { listingRoutes } from './services/items/listingRoutes';
import { onboardingRoutes } from './services/onboarding/onboardingRoutes';
import { adminOnboardingRoutes } from './services/onboarding/adminOnboardingRoutes';
import { fitRoutes } from './services/fit/fitRoutes';

const app = Fastify({ logger: true });

async function start() {
  await app.register(cors);
  await app.register(jwt, jwtConfig);

  app.decorate('authenticate', async function (req: any, reply: any) {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Register routes
  app.register(authRoutes);
  app.register(languageRoutes);
  app.register(ruleRoutes);
  app.register(ruleAcceptanceRoutes);
  app.register(userFitRoutes);
  app.register(itemFitRoutes);
  app.register(listingRoutes);
  app.register(onboardingRoutes);
  app.register(adminOnboardingRoutes);
  app.register(fitRoutes);

  await app.listen({ port: 3000 });
  console.log('🚀 Server running at http://localhost:3000');
}

start();