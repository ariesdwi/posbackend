-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "tableNumber" TEXT,
ALTER COLUMN "paymentMethod" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
