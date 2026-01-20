/*
  Warnings:

  - The values [E_WALLET] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('CASH', 'CARD', 'QRIS', 'TRANSFER', 'OTHER');
ALTER TABLE "public"."transactions" ALTER COLUMN "paymentMethod" DROP DEFAULT;
ALTER TABLE "transactions" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod_new" USING ("paymentMethod"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
ALTER TABLE "transactions" ALTER COLUMN "paymentMethod" SET DEFAULT 'CASH';
COMMIT;
