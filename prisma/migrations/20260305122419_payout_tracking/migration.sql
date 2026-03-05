-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "depositReleasedAt" TIMESTAMP(3),
ADD COLUMN     "ownerPayoutAt" TIMESTAMP(3);
