/*
  Warnings:

  - The primary key for the `UserTokens` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "UserTokens" DROP CONSTRAINT "UserTokens_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserTokens_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "UserTokens_refresh_token_idx" ON "UserTokens"("refresh_token");
