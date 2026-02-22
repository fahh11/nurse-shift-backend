/*
  Warnings:

  - You are about to drop the column `birth_date` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `mobile_phone` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nurse_shift_db"."user" DROP COLUMN "birth_date",
DROP COLUMN "mobile_phone",
DROP COLUMN "nickname";
