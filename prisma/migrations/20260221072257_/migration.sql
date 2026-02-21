-- CreateTable
CREATE TABLE "ConditionSnapshot" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "photoHash" TEXT NOT NULL,
    "checklist" TEXT NOT NULL,
    "capturedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConditionSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConditionSnapshot_itemId_bookingId_key" ON "ConditionSnapshot"("itemId", "bookingId");

-- AddForeignKey
ALTER TABLE "ConditionSnapshot" ADD CONSTRAINT "ConditionSnapshot_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
