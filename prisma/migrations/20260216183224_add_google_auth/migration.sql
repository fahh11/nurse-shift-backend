/*
  Warnings:

  - A unique constraint covering the columns `[google_email_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `google_email_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nurse_shift_db"."user" ADD COLUMN     "google_email_id" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_google_email_id_key" ON "nurse_shift_db"."user"("google_email_id");
