/*
  Warnings:

  - A unique constraint covering the columns `[user_id,ward_id]` on the table `ward_member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ward_member_user_id_ward_id_key" ON "nurse_shift_db"."ward_member"("user_id", "ward_id");
