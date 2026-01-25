import { PrismaClient, Language } from '../../generated/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        language: User['language'];
      };
    }
  }
}

export {};
