-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "nurse_shift_db";

-- CreateEnum
CREATE TYPE "nurse_shift_db"."WardStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "nurse_shift_db"."WardMemberRole" AS ENUM ('head_nurse', 'nurse');

-- CreateEnum
CREATE TYPE "nurse_shift_db"."ShiftTemplateType" AS ENUM ('morning', 'afternoon', 'night');

-- CreateEnum
CREATE TYPE "nurse_shift_db"."ShiftAssignmentType" AS ENUM ('shift', 'off', 'leave');

-- CreateEnum
CREATE TYPE "nurse_shift_db"."ShiftSwapRequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "nurse_shift_db"."user" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "nickname" VARCHAR(100),
    "birth_date" DATE,
    "personal_email" VARCHAR(255) NOT NULL,
    "line_user_id" VARCHAR(255) NOT NULL,
    "mobile_phone" VARCHAR(25) NOT NULL,
    "hospital_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "nurse_shift_db"."hospital" (
    "hospital_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "hospital_pkey" PRIMARY KEY ("hospital_id")
);

-- CreateTable
CREATE TABLE "nurse_shift_db"."ward" (
    "ward_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ward_code" VARCHAR(255) NOT NULL,
    "ward_name" VARCHAR(255) NOT NULL,
    "hospital_id" UUID NOT NULL,
    "join_code" VARCHAR(255) NOT NULL,
    "join_code_status" BOOLEAN NOT NULL DEFAULT true,
    "status" "nurse_shift_db"."WardStatus" NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ward_pkey" PRIMARY KEY ("ward_id")
);

-- CreateTable
CREATE TABLE "nurse_shift_db"."ward_member" (
    "ward_member_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "ward_id" UUID NOT NULL,
    "role" "nurse_shift_db"."WardMemberRole" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ward_member_pkey" PRIMARY KEY ("ward_member_id")
);

-- CreateTable
CREATE TABLE "nurse_shift_db"."shift_template" (
    "shift_template_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ward_id" UUID NOT NULL,
    "type" "nurse_shift_db"."ShiftTemplateType" NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "shift_template_pkey" PRIMARY KEY ("shift_template_id")
);

-- CreateTable
CREATE TABLE "nurse_shift_db"."shift_requirement" (
    "shift_requirement_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shift_template_id" UUID NOT NULL,
    "required_people" INTEGER NOT NULL,
    "effective_from" DATE NOT NULL,
    "effective_to" DATE,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "shift_requirement_pkey" PRIMARY KEY ("shift_requirement_id")
);

-- CreateTable
CREATE TABLE "nurse_shift_db"."shift_assignment" (
    "shift_assignment_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shift_template_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "assignment_type" "nurse_shift_db"."ShiftAssignmentType" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "shift_assignment_pkey" PRIMARY KEY ("shift_assignment_id")
);

-- CreateTable
CREATE TABLE "nurse_shift_db"."shift_swap_request" (
    "shift_swap_request_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "requester_user_id" UUID NOT NULL,
    "approver_user_id" UUID NOT NULL,
    "requester_assignment_id" UUID NOT NULL,
    "approver_assignment_id" UUID NOT NULL,
    "status" "nurse_shift_db"."ShiftSwapRequestStatus" NOT NULL,
    "note" VARCHAR(255) NOT NULL,
    "requested_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(6),

    CONSTRAINT "shift_swap_request_pkey" PRIMARY KEY ("shift_swap_request_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_personal_email_key" ON "nurse_shift_db"."user"("personal_email");

-- CreateIndex
CREATE UNIQUE INDEX "user_line_user_id_key" ON "nurse_shift_db"."user"("line_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ward_join_code_key" ON "nurse_shift_db"."ward"("join_code");

-- CreateIndex
CREATE UNIQUE INDEX "shift_requirement_shift_template_id_effective_from_key" ON "nurse_shift_db"."shift_requirement"("shift_template_id", "effective_from");

-- CreateIndex
CREATE UNIQUE INDEX "shift_assignment_user_id_date_key" ON "nurse_shift_db"."shift_assignment"("user_id", "date");

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."user" ADD CONSTRAINT "user_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "nurse_shift_db"."hospital"("hospital_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."ward" ADD CONSTRAINT "ward_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "nurse_shift_db"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."ward" ADD CONSTRAINT "ward_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "nurse_shift_db"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."ward" ADD CONSTRAINT "ward_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "nurse_shift_db"."hospital"("hospital_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."ward_member" ADD CONSTRAINT "ward_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "nurse_shift_db"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."ward_member" ADD CONSTRAINT "ward_member_ward_id_fkey" FOREIGN KEY ("ward_id") REFERENCES "nurse_shift_db"."ward"("ward_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."shift_template" ADD CONSTRAINT "shift_template_ward_id_fkey" FOREIGN KEY ("ward_id") REFERENCES "nurse_shift_db"."ward"("ward_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."shift_requirement" ADD CONSTRAINT "shift_requirement_shift_template_id_fkey" FOREIGN KEY ("shift_template_id") REFERENCES "nurse_shift_db"."shift_template"("shift_template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."shift_assignment" ADD CONSTRAINT "shift_assignment_shift_template_id_fkey" FOREIGN KEY ("shift_template_id") REFERENCES "nurse_shift_db"."shift_template"("shift_template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."shift_assignment" ADD CONSTRAINT "shift_assignment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "nurse_shift_db"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."shift_swap_request" ADD CONSTRAINT "shift_swap_request_requester_user_id_fkey" FOREIGN KEY ("requester_user_id") REFERENCES "nurse_shift_db"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."shift_swap_request" ADD CONSTRAINT "shift_swap_request_approver_user_id_fkey" FOREIGN KEY ("approver_user_id") REFERENCES "nurse_shift_db"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."shift_swap_request" ADD CONSTRAINT "shift_swap_request_requester_assignment_id_fkey" FOREIGN KEY ("requester_assignment_id") REFERENCES "nurse_shift_db"."shift_assignment"("shift_assignment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nurse_shift_db"."shift_swap_request" ADD CONSTRAINT "shift_swap_request_approver_assignment_id_fkey" FOREIGN KEY ("approver_assignment_id") REFERENCES "nurse_shift_db"."shift_assignment"("shift_assignment_id") ON DELETE RESTRICT ON UPDATE CASCADE;
