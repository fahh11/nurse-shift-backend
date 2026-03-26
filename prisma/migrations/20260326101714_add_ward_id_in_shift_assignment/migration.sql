/*
  Warnings:

  - A unique constraint covering the columns `[user_id,date,shift_template_id]` on the table `shift_assignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ward_id` to the `shift_assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "nurse_shift_db"."shift_assignment_user_id_date_key";

-- AlterTable
ALTER TABLE "nurse_shift_db"."shift_assignment" ADD COLUMN     "ward_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "shift_assignment_user_id_date_shift_template_id_key" ON "nurse_shift_db"."shift_assignment"("user_id", "date", "shift_template_id");

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."shift_assignment" ADD CONSTRAINT "shift_assignment_ward_id_fkey" FOREIGN KEY ("ward_id") REFERENCES "nurse_shift_db"."ward"("ward_id") ON DELETE RESTRICT ON UPDATE CASCADE;
