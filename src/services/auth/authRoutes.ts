import { FastifyInstance } from 'fastify';
import { sendOtp, verifyOtp } from '../../infra/auth/otpService';
import { prisma } from '../../infra/db/prisma';
import { UserRole, UserStatus, Language } from '../../domain';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', async (req, reply) => {
    const { phone } = req.body as { phone: string };

    const otp = await sendOtp(phone);

    (app as any).otpStore = (app as any).otpStore || {};
    (app as any).otpStore[phone] = otp;

    return { success: true };
  });

  app.post('/auth/verify', async (req, reply) => {
    const { phone, otp } = req.body as { phone: string; otp: string };

    const actualOtp = (app as any).otpStore?.[phone];

    if (!verifyOtp(otp, actualOtp)) {
      return reply.status(401).send({ error: 'Invalid OTP' });
    }

    let user = await prisma.user.findUnique({
  where: { phone },
});

if (!user) {
  user = await prisma.user.create({
    data: {
      phone,
      role: UserRole.RENTER,
      status: UserStatus.ACTIVE,
      language: Language.EN,
    },
  });
} 

    const token = app.jwt.sign({
      userId: user.id,
      role: user.role,
      status: user.status,
    });

    return { token };
  });
}
