/*
  Warnings:

  - Added the required column `businessId` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'BUSINESS_OWNER';

-- DropForeignKey
ALTER TABLE "transaction_items" DROP CONSTRAINT "transaction_items_productId_fkey";

-- DropIndex
DROP INDEX "categories_name_key";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "businessId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "businessId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transaction_items" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "businessId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "businessId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
