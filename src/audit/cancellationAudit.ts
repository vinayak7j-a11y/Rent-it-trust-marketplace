import { prisma } from '../infra/db/prisma';
import { Prisma } from '@prisma/client';
import { cancelBooking } from '../services/booking/bookingCancellationService';
import { lockEscrow } from '../services/wallet/escrowService';
import { UserStatus, ItemState, BookingState } from '../domain/enums';
async function runCancellationAudit() {
  console.log('--- STARTING CANCELLATION AUDIT ---');

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

    // 🔥 Clean previous test data (correct dependency order)
    await tx.booking.deleteMany({});
    await tx.escrow.deleteMany({});
    await tx.ledgerEntry.deleteMany({});
    await tx.wallet.deleteMany({});
    await tx.item.deleteMany({});
    await tx.user.deleteMany({});

    const renter = await tx.user.create({
      data: {
        phone: '8888888881',
        role: 'renter',
        status: UserStatus.ACTIVE,
        language: 'en',
        trustScore: 50,
      },
    });

    const owner = await tx.user.create({
      data: {
        phone: '8888888882',
        role: 'owner',
        status: UserStatus.ACTIVE,
        language: 'en',
        trustScore: 50,
      },
    });

    const renterWallet = await tx.wallet.create({
      data: {
        userId: renter.id,
        availableBalance: 1000000,
        escrowBalance: 0,
      },
    });

    await tx.wallet.create({
      data: {
        userId: owner.id,
        availableBalance: 0,
        escrowBalance: 0,
      },
    });

    const item = await tx.item.create({
      data: {
        ownerId: owner.id,
        category: 'wedding',
        gender: 'men',
        size: 'L',
        fabric: 'suit',
        wearLevel: 'new',
        state: ItemState.LISTED,
        zone: 'indore-central',
        isVisible: true,
      },
    });

    const rentalFee = 300000;
    const deposit = 200000;

    await lockEscrow(renterWallet.id, rentalFee + deposit, tx);

    const booking = await tx.booking.create({
      data: {
        userId: renter.id,
        itemId: item.id,
        rentalFee,
        deposit,
        state: BookingState.APPROVED, // ✅ correct spelling
        startDate: new Date(),
        endDate: new Date(),
      },
    });

    console.log('Booking created, cancelling now...');

    await cancelBooking(booking.id, renter.id, tx);

    console.log('Cancellation executed');
  });

  console.log('--- AUDIT COMPLETE ---');
}

runCancellationAudit()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });