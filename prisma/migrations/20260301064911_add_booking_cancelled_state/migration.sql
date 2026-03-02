/*
  Warnings:

  - You are about to drop the column `createdAt` on the `FitAcceptance` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BookingState" AS ENUM ('requested', 'approved', 'picked_up', 'returned', 'closed', 'cancelled');

-- AlterTable
ALTER TABLE "FitAcceptance" DROP COLUMN "createdAt",
ADD COLUMN     "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
