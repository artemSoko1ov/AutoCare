-- CreateTable
CREATE TABLE "CarSnapshot" (
    "id" TEXT NOT NULL,
    "sourceCarId" TEXT,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CarSnapshot_sourceCarId_idx" ON "CarSnapshot"("sourceCarId");

-- AddForeignKey
ALTER TABLE "CarSnapshot"
ADD CONSTRAINT "CarSnapshot_sourceCarId_fkey"
FOREIGN KEY ("sourceCarId") REFERENCES "Car"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
