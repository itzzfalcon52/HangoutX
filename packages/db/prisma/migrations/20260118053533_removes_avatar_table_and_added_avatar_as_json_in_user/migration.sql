/*
  Warnings:

  - You are about to drop the column `avatarId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Avatar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_avatarId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarId",
ADD COLUMN     "avatar" JSONB;

-- DropTable
DROP TABLE "Avatar";
