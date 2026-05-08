import { FastifyInstance } from 'fastify';
import { sendOtp, verifyOtp } from '../../infra/auth/otpService';
import { prisma } from '../../infra/db/prisma';
import { UserRole, UserStatus, Language } from '../../domain';
import { getOrCreateWallet } from '../wallet/walletService';

type LoginBody = {
  phone: string;
};

type VerifyBody = {
  phone: string;
  otp: string;
};

export async function authRoutes(app: FastifyInstance) {

  // 🔹 SEND OTP
  app.post('/auth/login', async (req, reply) => {
    const { phone } = req.body as LoginBody;

    if (!phone) {
      return reply.status(400).send({ error: 'Phone required' });
    }

    const otp = await sendOtp(phone);

    // ⚠️ TEMP: in-memory (replace with Redis later)
    (app as any).otpStore = {
      ...(app as any).otpStore,
      [phone]: otp,
    };

    return { success: true };
  });

  // 🔹 VERIFY OTP + LOGIN
  app.post('/auth/verify', async (req, reply) => {
    const { phone, otp } = req.body as VerifyBody;

    if (!phone || !otp) {
      return reply.status(400).send({ error: 'Phone and OTP required' });
    }

    const actualOtp = (app as any).otpStore?.[phone];

    if (!actualOtp || !verifyOtp(otp, actualOtp)) {
      return reply.status(401).send({ error: 'Invalid OTP' });
    }

    // 🔒 Prevent OTP reuse
    delete (app as any).otpStore[phone];

    let user = await prisma.user.findUnique({
      where: { phone },
    });

    // 🔹 CREATE USER IF NOT EXISTS
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

    // 🔹 ENSURE WALLET EXISTS
    await getOrCreateWallet(user.id);

    // 🔹 GENERATE JWT (INCLUDES ROLE — CRITICAL)
    const token = app.jwt.sign(
      {
        userId: user.id,
        role: user.role,
        status: user.status,
      },
      {
        expiresIn: '7d',
      }
    );

    return { token };
  });
}