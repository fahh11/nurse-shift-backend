/*
  Warnings:

  - Added the required column `created_by` to the `shift_assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `shift_assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nurse_shift_db"."shift_assignment" ADD COLUMN     "created_by" UUID NOT NULL,
ADD COLUMN     "updated_by" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."shift_assignment" ADD CONSTRAINT "shift_assignment_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "nurse_shift_db"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."shift_assignment" ADD CONSTRAINT "shift_assignment_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "nurse_shift_db"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
