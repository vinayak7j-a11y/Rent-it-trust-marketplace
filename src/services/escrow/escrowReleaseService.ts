import { PrismaClient } from '@prisma/client';
import { getOrCreateWallet } from '../wallet/walletService';
import { appendLedgerEntry } from '../wallet/ledgerService';

const prisma = new PrismaClient();

export async function releaseEscrow(bookingId: string) {
  const escrow = await prisma.escrow.findUnique({
    where: { bookingId },
  });

  if (!escrow) {
    throw new Error('Escrow not found');
  }

  if (escrow.status !== 'held') {
    throw new Error('Escrow is not releasable');
  }

  const ownerWallet = await getOrCreateWallet(escrow.ownerId);
  const renterWallet = await getOrCreateWallet(escrow.renterId);

  // 1️⃣ Pay owner rental fee
  await appendLedgerEntry({
    walletId: ownerWallet.id,
    amount: escrow.rentalFee,
    type: 'credit',
    reason: 'Rental payout',
    referenceId: bookingId,
  });

  // 2️⃣ Return deposit to renter
  await appendLedgerEntry({
    walletId: renterWallet.id,
    amount: escrow.deposit,
    type: 'credit',
    reason: 'Deposit returned',
    referenceId: bookingId,
  });

  // 3️⃣ Update escrow status LAST
  return prisma.escrow.update({
    where: { bookingId },
    data: { status: 'released' },
  });
}
