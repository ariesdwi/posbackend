-- AlterEnum
-- Remove unused payment methods (CARD, TRANSFER) and add new ones (DEBIT, GRABFOOD, SHOPEEFOOD, GOFOOD)
-- Step 1: Update existing CARD values to OTHER (will be manually changed to DEBIT by business)
UPDATE "transactions" SET "paymentMethod" = 'OTHER'::"PaymentMethod" WHERE "paymentMethod" = 'CARD'::"PaymentMethod";

-- Step 2: Keep TRANSFER as OTHER for now
UPDATE "transactions" SET "paymentMethod" = 'OTHER'::"PaymentMethod" WHERE "paymentMethod" = 'TRANSFER'::"PaymentMethod";

-- Step 3: Create new enum type with new values
CREATE TYPE "PaymentMethod_new" AS ENUM ('CASH', 'QRIS', 'DEBIT', 'GRABFOOD', 'SHOPEEFOOD', 'GOFOOD', 'OTHER');

-- Step 4: Alter column to use new enum
ALTER TABLE "transactions" ALTER COLUMN "paymentMethod" DROP DEFAULT;
ALTER TABLE "transactions" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod_new" USING ("paymentMethod"::text::"PaymentMethod_new");

-- Step 5: Rename old enum and assign new enum
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";

-- Step 6: Drop old enum
DROP TYPE "PaymentMethod_old";

-- Step 7: Set default back
ALTER TABLE "transactions" ALTER COLUMN "paymentMethod" SET DEFAULT 'CASH'::"PaymentMethod";

-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "shifts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "status" "ShiftStatus" NOT NULL DEFAULT 'OPEN',
    "initialCash" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "finalCash" DECIMAL(10,2),
    "expectedCash" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "cashDifference" DECIMAL(10,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shifts_userId_idx" ON "shifts"("userId");

-- CreateIndex
CREATE INDEX "shifts_businessId_idx" ON "shifts"("businessId");

-- CreateIndex
CREATE INDEX "shifts_status_idx" ON "shifts"("status");

-- CreateIndex
CREATE INDEX "shifts_startTime_idx" ON "shifts"("startTime");

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN "shiftId" TEXT;

-- CreateIndex
CREATE INDEX "transactions_shiftId_idx" ON "transactions"("shiftId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "shifts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
