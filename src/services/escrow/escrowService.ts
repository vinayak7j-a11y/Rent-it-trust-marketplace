import { PrismaClient } from '@prisma/client';
import { getOrCreateWallet } from '../wallet/walletService';
import { appendLedgerEntry } from '../wallet/ledgerService';

const prisma = new PrismaClient();

type CreateEscrowInput = {
  bookingId: string;
  renterId: string;
  ownerId: string;
  rentalFee: number; // paise
  deposit: number;   // paise
};

export async function createEscrow(input: CreateEscrowInput) {
  if (input.rentalFee <= 0 || input.deposit < 0) {
    throw new Error('Invalid escrow amounts');
  }

  // Prevent duplicate escrow
  const existing = await prisma.escrow.findUnique({
    where: { bookingId: input.bookingId },
  });

  if (existing) {
    throw new Error('Escrow already exists for booking');
  }

  const renterWallet = await getOrCreateWallet(input.renterId);

  // 1️⃣ Money moves FIRST
  await appendLedgerEntry({
    walletId: renterWallet.id,
    amount: input.rentalFee + input.deposit,
    type: 'debit',
    reason: 'Escrow hold for booking',
    referenceId: input.bookingId,
  });

  // 2️⃣ Escrow reflects locked reality
  return prisma.escrow.create({
    data: {
      bookingId: input.bookingId,
      renterId: input.renterId,
      ownerId: input.ownerId,
      rentalFee: input.rentalFee,
      deposit: input.deposit,
      status: 'held',
    },
  });
}
