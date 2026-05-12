-- DropForeignKey
ALTER TABLE "nurse_shift_db"."shift_assignment" DROP CONSTRAINT "shift_assignment_shift_template_id_fkey";

-- AlterTable
ALTER TABLE "nurse_shift_db"."shift_assignment" ALTER COLUMN "shift_template_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."shift_assignment" ADD CONSTRAINT "shift_assignment_shift_template_id_fkey" FOREIGN KEY ("shift_template_id") REFERENCES "nurse_shift_db"."shift_template"("shift_template_id") ON DELETE SET NULL ON UPDATE CASCADE;
