/*
  Warnings:

  - You are about to drop the column `tokenExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tokenHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tokenPurpose` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[activationTokenHash]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_tokenHash_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "tokenExpiresAt",
DROP COLUMN "tokenHash",
DROP COLUMN "tokenPurpose",
ADD COLUMN     "activationTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "activationTokenHash" TEXT;

-- DropEnum
DROP TYPE "TokenPurpose";

-- CreateIndex
CREATE UNIQUE INDEX "User_activationTokenHash_key" ON "User"("activationTokenHash");
