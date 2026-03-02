/*
  Warnings:

  - You are about to drop the column `acceptedAt` on the `FitAcceptance` table. All the data in the column will be lost.
  - You are about to drop the column `bookingId` on the `FitAcceptance` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `Wallet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,itemId]` on the table `FitAcceptance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `FitAcceptance` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FitAcceptance_userId_bookingId_key";

-- AlterTable
ALTER TABLE "FitAcceptance" DROP COLUMN "acceptedAt",
DROP COLUMN "bookingId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "itemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "balance",
ADD COLUMN     "availableBalance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "escrowBalance" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "rentalFee" INTEGER NOT NULL,
    "deposit" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FitAcceptance_userId_itemId_key" ON "FitAcceptance"("userId", "itemId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FitAcceptance" ADD CONSTRAINT "FitAcceptance_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
