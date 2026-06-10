-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM (
    'new',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled'
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceId" TEXT,
    "carSnapshotId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "serviceTitle" TEXT NOT NULL,
    "serviceCategory" TEXT NOT NULL,
    "serviceIconPath" TEXT NOT NULL,
    "servicePriceFrom" INTEGER NOT NULL,
    "serviceDurationLabel" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "quotedPrice" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_carSnapshotId_key" ON "Order"("carSnapshotId");

-- CreateIndex
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Order_serviceId_idx" ON "Order"("serviceId");

-- AddForeignKey
ALTER TABLE "Order"
ADD CONSTRAINT "Order_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order"
ADD CONSTRAINT "Order_serviceId_fkey"
FOREIGN KEY ("serviceId") REFERENCES "Service"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order"
ADD CONSTRAINT "Order_carSnapshotId_fkey"
FOREIGN KEY ("carSnapshotId") REFERENCES "CarSnapshot"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
