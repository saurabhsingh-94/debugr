-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "message" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "paymentId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" TEXT,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;
