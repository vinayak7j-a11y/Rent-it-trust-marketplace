import 'dotenv/config';

import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import { jwtConfig } from './infra/auth/jwt';

import { authRoutes } from './services/auth/authRoutes';
import { languageRoutes } from './services/auth/languageRoutes';
import { ruleRoutes } from './services/rules/ruleRoutes';

const app = Fastify();

app.register(jwt, jwtConfig);

app.decorate('authenticate', async (req: any) => {
  await req.jwtVerify();
});

app.register(authRoutes);
app.register(languageRoutes);
app.register(ruleRoutes);

export default app;
