-- AlterTable
ALTER TABLE "products" ADD COLUMN     "costPrice" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "transaction_items" ADD COLUMN     "costPrice" DECIMAL(10,2) NOT NULL DEFAULT 0;
