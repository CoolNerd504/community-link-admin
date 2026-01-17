-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'EARNING', 'REFUND');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DisputeStatus" ADD VALUE 'PENDING';
ALTER TYPE "DisputeStatus" ADD VALUE 'INVESTIGATING';
ALTER TYPE "DisputeStatus" ADD VALUE 'DISMISSED';

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';

-- DropForeignKey
ALTER TABLE "Dispute" DROP CONSTRAINT "Dispute_sessionId_fkey";

-- AlterTable
ALTER TABLE "BookingRequest" ADD COLUMN     "requestedTime" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Dispute" ADD COLUMN     "description" TEXT,
ADD COLUMN     "notes" JSONB,
ADD COLUMN     "reportedAgainstId" TEXT,
ADD COLUMN     "reportedById" TEXT,
ADD COLUMN     "resolution" TEXT,
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ALTER COLUMN "sessionId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "pendingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currency" TEXT NOT NULL DEFAULT 'ZMW',
    "totalMinutesPurchased" INTEGER NOT NULL DEFAULT 0,
    "totalMinutesUsed" INTEGER NOT NULL DEFAULT 0,
    "availableMinutes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutRequest" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "bankDetails" TEXT,
    "notes" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayoutRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingTier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pricePerMinute" DOUBLE PRECISION NOT NULL,
    "maxSessionsPerDay" INTEGER NOT NULL DEFAULT 10,
    "features" JSONB,
    "bundleDiscounts" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundlePricing" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BundlePricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinutePackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "priceZMW" DOUBLE PRECISION NOT NULL,
    "discountPercent" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MinutePackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinutePurchase" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "minutesPurchased" INTEGER NOT NULL,
    "priceZMW" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MinutePurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinuteUsage" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "minutesUsed" INTEGER NOT NULL,
    "ratePerMinute" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinuteUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderEarnings" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "totalMinutesServiced" INTEGER NOT NULL DEFAULT 0,
    "currentMonthMinutes" INTEGER NOT NULL DEFAULT 0,
    "totalEarningsZMW" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentMonthEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pendingPayoutZMW" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastPayoutDate" TIMESTAMP(3),
    "lastPayoutAmount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderEarnings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PricingTier_name_key" ON "PricingTier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MinuteUsage_sessionId_key" ON "MinuteUsage"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderEarnings_providerId_key" ON "ProviderEarnings"("providerId");

-- AddForeignKey
ALTER TABLE "BookingRequest" ADD CONSTRAINT "BookingRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutRequest" ADD CONSTRAINT "PayoutRequest_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AppSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_reportedAgainstId_fkey" FOREIGN KEY ("reportedAgainstId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinutePurchase" ADD CONSTRAINT "MinutePurchase_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinuteUsage" ADD CONSTRAINT "MinuteUsage_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinuteUsage" ADD CONSTRAINT "MinuteUsage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AppSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderEarnings" ADD CONSTRAINT "ProviderEarnings_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
