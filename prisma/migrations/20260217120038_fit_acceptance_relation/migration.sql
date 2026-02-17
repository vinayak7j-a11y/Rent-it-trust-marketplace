-- CreateTable
CREATE TABLE "FitAcceptance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FitAcceptance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FitAcceptance_userId_bookingId_key" ON "FitAcceptance"("userId", "bookingId");

-- AddForeignKey
ALTER TABLE "FitAcceptance" ADD CONSTRAINT "FitAcceptance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
