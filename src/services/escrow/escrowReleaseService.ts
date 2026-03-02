import { Prisma } from '@prisma/client';

type ReleaseEscrowInput = {
  bookingId: string;
  renterId: string;
  ownerId: string;
  rentalFee: number;
  deposit: number;
  damageCharge?: number; // optional
};

export async function releaseEscrow(
  input: ReleaseEscrowInput,
  tx: Prisma.TransactionClient
) {
  const totalHeld = input.rentalFee + input.deposit;

  const renterWallet = await tx.wallet.findUnique({
    where: { userId: input.renterId },
  });

  const ownerWallet = await tx.wallet.findUnique({
    where: { userId: input.ownerId },
  });

  if (!renterWallet || !ownerWallet) {
    throw new Error('Wallet not found');
  }

  if (renterWallet.escrowBalance < totalHeld) {
    throw new Error('Escrow balance mismatch');
  }

  const damage = input.damageCharge ?? 0;

  if (damage < 0 || damage > input.deposit) {
    throw new Error('Invalid damage charge');
  }

  const ownerReceives = input.rentalFee + damage;
  const renterRefund = input.deposit - damage;

  // 1️⃣ Deduct total from renter escrow
  await tx.wallet.update({
    where: { id: renterWallet.id },
    data: {
      escrowBalance: renterWallet.escrowBalance - totalHeld,
    },
  });

  // 2️⃣ Credit owner
  await tx.wallet.update({
    where: { id: ownerWallet.id },
    data: {
      availableBalance: ownerWallet.availableBalance + ownerReceives,
    },
  });

  // 3️⃣ Refund renter deposit remainder
  if (renterRefund > 0) {
    await tx.wallet.update({
      where: { id: renterWallet.id },
      data: {
        availableBalance: renterWallet.availableBalance + renterRefund,
      },
    });
  }

  // 4️⃣ Ledger logging
  await tx.ledgerEntry.createMany({
    data: [
      {
        walletId: renterWallet.id,
        amount: -totalHeld,
        type: 'escrow_release',
        reason: 'Escrow released after booking',
      },
      {
        walletId: ownerWallet.id,
        amount: ownerReceives,
        type: 'owner_payout',
        reason: 'Rental payout',
      },
      ...(renterRefund > 0
        ? [
            {
              walletId: renterWallet.id,
              amount: renterRefund,
              type: 'deposit_refund',
              reason: 'Deposit refund',
            },
          ]
        : []),
    ],
  });
}