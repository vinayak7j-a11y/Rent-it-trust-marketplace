import 'dotenv/config';
import Fastify from 'fastify';
import jwt from '@fastify/jwt';

import { jwtConfig } from './infra/auth/jwt';
import { authRoutes } from './services/auth/authRoutes';
import { languageRoutes } from './services/auth/languageRoutes';
import { ruleRoutes } from './services/rules/ruleRoutes';
import { itemFitRoutes } from './services/items/itemFitRoutes';

const app = Fastify();

// JWT
app.register(jwt, jwtConfig);

// Auth decorator
app.decorate('authenticate', async (req: any, reply: any) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
}); 

// Health route
app.get('/', async () => {
  return { status: 'Rent It API running' };
});

// Route registrations
app.register(authRoutes);
app.register(languageRoutes);
app.register(ruleRoutes);
app.register(itemFitRoutes);

export default app;

// START SERVER LAST
const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running at http://localhost:3000');
  } catch (err) {
    console.error('START ERROR:', err);
    process.exit(1);
  }
}; 

start();
