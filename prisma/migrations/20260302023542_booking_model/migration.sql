/*
  Warnings:

  - You are about to drop the `UserRuleAcceptance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRuleAcceptance" DROP CONSTRAINT "UserRuleAcceptance_ruleVersionId_fkey";

-- DropForeignKey
ALTER TABLE "UserRuleAcceptance" DROP CONSTRAINT "UserRuleAcceptance_userId_fkey";

-- DropTable
DROP TABLE "UserRuleAcceptance";

-- CreateTable
CREATE TABLE "RuleAcceptance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ruleVersionId" TEXT,

    CONSTRAINT "RuleAcceptance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RuleAcceptance_userId_ruleId_key" ON "RuleAcceptance"("userId", "ruleId");

-- AddForeignKey
ALTER TABLE "RuleAcceptance" ADD CONSTRAINT "RuleAcceptance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuleAcceptance" ADD CONSTRAINT "RuleAcceptance_ruleVersionId_fkey" FOREIGN KEY ("ruleVersionId") REFERENCES "RuleVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
