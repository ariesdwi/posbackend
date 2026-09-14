-- Phase 1: X-Report & Z-Report System with Void/Discount Tracking

-- Add new fields to shifts table
ALTER TABLE "shifts" ADD COLUMN "xReportCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "shifts" ADD COLUMN "lastXReportAt" TIMESTAMP(3);
ALTER TABLE "shifts" ADD COLUMN "totalVoidCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "shifts" ADD COLUMN "totalVoidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "shifts" ADD COLUMN "totalDiscountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "shifts" ADD COLUMN "technicalIssues" TEXT;
ALTER TABLE "shifts" ADD COLUMN "inventoryNotes" TEXT;

-- Add void tracking fields to transactions table
ALTER TABLE "transactions" ADD COLUMN "isVoid" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "transactions" ADD COLUMN "voidReason" TEXT;
ALTER TABLE "transactions" ADD COLUMN "voidedAt" TIMESTAMP(3);
ALTER TABLE "transactions" ADD COLUMN "voidedBy" TEXT;

-- Add discount tracking fields to transactions table
ALTER TABLE "transactions" ADD COLUMN "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "transactions" ADD COLUMN "discountNotes" TEXT;

-- Create index for void transactions
CREATE INDEX "transactions_isVoid_idx" ON "transactions"("isVoid");

-- CreateTable: x_reports
CREATE TABLE "x_reports" (
    "id" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "reportNumber" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generatedBy" TEXT NOT NULL,
    "totalSales" DECIMAL(10,2) NOT NULL,
    "totalTransactions" INTEGER NOT NULL,
    "cashSales" DECIMAL(10,2) NOT NULL,
    "qrisSales" DECIMAL(10,2) NOT NULL,
    "debitSales" DECIMAL(10,2) NOT NULL,
    "grabfoodSales" DECIMAL(10,2) NOT NULL,
    "shopeefoodSales" DECIMAL(10,2) NOT NULL,
    "gofoodSales" DECIMAL(10,2) NOT NULL,
    "otherSales" DECIMAL(10,2) NOT NULL,
    "voidCount" INTEGER NOT NULL DEFAULT 0,
    "voidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "x_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "x_reports_reportNumber_key" ON "x_reports"("reportNumber");

-- CreateIndex
CREATE INDEX "x_reports_shiftId_idx" ON "x_reports"("shiftId");

-- CreateIndex
CREATE INDEX "x_reports_generatedAt_idx" ON "x_reports"("generatedAt");

-- AddForeignKey
ALTER TABLE "x_reports" ADD CONSTRAINT "x_reports_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "shifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "x_reports" ADD CONSTRAINT "x_reports_generatedBy_fkey" FOREIGN KEY ("generatedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
