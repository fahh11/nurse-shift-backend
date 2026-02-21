-- DropForeignKey
ALTER TABLE "nurse_shift_db"."user" DROP CONSTRAINT "user_hospital_id_fkey";

-- AlterTable
ALTER TABLE "nurse_shift_db"."user" ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "line_user_id" DROP NOT NULL,
ALTER COLUMN "mobile_phone" DROP NOT NULL,
ALTER COLUMN "hospital_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."user" ADD CONSTRAINT "user_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "nurse_shift_db"."hospital"("hospital_id") ON DELETE SET NULL ON UPDATE CASCADE;
