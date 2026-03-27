-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountHolderName" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "expertise" TEXT,
ADD COLUMN     "ifscCode" TEXT,
ADD COLUMN     "isProfessional" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "professionalStatus" TEXT NOT NULL DEFAULT 'UNCONFIGURED',
ADD COLUMN     "profileVisits" INTEGER NOT NULL DEFAULT 0;
