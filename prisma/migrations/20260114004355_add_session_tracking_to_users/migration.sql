/*
  Warnings:

  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isActive",
ADD COLUMN     "current_device_id" TEXT,
ADD COLUMN     "current_session_token" TEXT,
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ALTER COLUMN "role" DROP DEFAULT;
