/*
  Warnings:

  - You are about to drop the column `activationTokenExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `activationTokenHash` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_activationTokenHash_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "activationTokenExpiresAt",
DROP COLUMN "activationTokenHash";
