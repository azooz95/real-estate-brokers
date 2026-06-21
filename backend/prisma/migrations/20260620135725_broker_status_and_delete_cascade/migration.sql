-- CreateEnum
CREATE TYPE "BrokerStatus" AS ENUM ('active', 'suspended');

-- AlterTable
ALTER TABLE "Broker" ADD COLUMN     "status" "BrokerStatus" NOT NULL DEFAULT 'active';
