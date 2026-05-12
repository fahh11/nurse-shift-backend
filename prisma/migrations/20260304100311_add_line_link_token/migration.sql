/*
  Warnings:

  - A unique constraint covering the columns `[line_link_token]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "nurse_shift_db"."user" ADD COLUMN     "line_link_token" UUID,
ADD COLUMN     "line_link_token_expire" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "user_line_link_token_key" ON "nurse_shift_db"."user"("line_link_token");
