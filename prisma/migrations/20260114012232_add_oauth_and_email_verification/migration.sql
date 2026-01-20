-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verification_expires" TIMESTAMP(3),
ADD COLUMN     "email_verification_token" TEXT,
ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "oauth_provider" TEXT,
ADD COLUMN     "oauth_provider_id" TEXT,
ADD COLUMN     "password_reset_expires" TIMESTAMP(3),
ADD COLUMN     "password_reset_token" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
