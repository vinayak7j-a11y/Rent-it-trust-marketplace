-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "damagePenalty" INTEGER,
ADD COLUMN     "damageType" TEXT,
ADD COLUMN     "returnVerifiedAt" TIMESTAMP(3);
