/*
  Warnings:

  - Added the required column `moduleType` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "data" JSONB,
ADD COLUMN     "moduleType" TEXT NOT NULL,
ADD COLUMN     "score" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "radius" INTEGER NOT NULL DEFAULT 50;

-- CreateTable
CREATE TABLE "CareerProject" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titlePt" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionFr" TEXT,
    "descriptionPt" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "targetJobIds" TEXT[],
    "isEntrepreneurship" BOOLEAN NOT NULL DEFAULT false,
    "businessType" TEXT,
    "sector" TEXT,
    "startDate" TIMESTAMP(3),
    "targetDate" TIMESTAMP(3),
    "fundingNeeded" DOUBLE PRECISION,
    "trainingNeeded" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accessibility" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hasVisualImpairment" BOOLEAN NOT NULL DEFAULT false,
    "hasHearingImpairment" BOOLEAN NOT NULL DEFAULT false,
    "hasMobilityImpairment" BOOLEAN NOT NULL DEFAULT false,
    "hasCognitiveImpairment" BOOLEAN NOT NULL DEFAULT false,
    "otherImpairment" TEXT,
    "needsAssistiveTech" BOOLEAN NOT NULL DEFAULT false,
    "needsWorkplaceAdaptation" BOOLEAN NOT NULL DEFAULT false,
    "needsTransportSupport" BOOLEAN NOT NULL DEFAULT false,
    "localSupportOrgs" TEXT[],
    "governmentAid" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accessibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formation" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titlePt" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionFr" TEXT,
    "descriptionPt" TEXT,
    "provider" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "relatedJobIds" TEXT[],
    "duration" TEXT,
    "cost" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'USD',
    "url" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "isCertified" BOOLEAN NOT NULL DEFAULT false,
    "isGovernmentFunded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Formation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "pdfUrl" TEXT,
    "generatedAt" TIMESTAMP(3),
    "certificationHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleNumber" INTEGER NOT NULL,
    "moduleName" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModuleProgress_userId_moduleNumber_key" ON "ModuleProgress"("userId", "moduleNumber");

-- AddForeignKey
ALTER TABLE "CareerProject" ADD CONSTRAINT "CareerProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accessibility" ADD CONSTRAINT "Accessibility_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleProgress" ADD CONSTRAINT "ModuleProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
