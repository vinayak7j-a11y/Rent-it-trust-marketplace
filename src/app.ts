import { listingRoutes } from './services/items/listingRoutes';
import 'dotenv/config';
import Fastify from 'fastify';
import jwt from '@fastify/jwt';

import { jwtConfig } from './infra/auth/jwt';
import { authRoutes } from './services/auth/authRoutes';
import { languageRoutes } from './services/auth/languageRoutes';
import { ruleRoutes } from './services/rules/ruleRoutes';
import { itemFitRoutes } from './services/items/itemFitRoutes'; 
import { searchRoutes } from './services/discovery/searchRoutes';
import { prisma } from './infra/db/prisma'; // make sure this import exists

const app = Fastify();

// JWT
app.register(jwt, jwtConfig);

// Auth decorator
app.decorate(
  'authenticate',
  async function (req: any, reply: any) {
    try {
      await req.jwtVerify();
    } catch (err) {
      return reply.send(err);
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
app.register(searchRoutes);
export default app;
app.post('/dev/add-condition/:id', async (req: any, reply) => {
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
});
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

start();
