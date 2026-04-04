-- DropIndex
DROP INDEX "nurse_shift_db"."shift_assignment_user_id_date_shift_template_id_key";

-- Create PARTIAL UNIQUE INDEX (soft delete support)
CREATE UNIQUE INDEX "unique_active_shift_assignment"
ON "nurse_shift_db"."shift_assignment"
(
  user_id,
  date,
  shift_template_id
)
WHERE deleted_at IS NULL;