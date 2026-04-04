CREATE UNIQUE INDEX unique_pending_swap_pair
ON nurse_shift_db.shift_swap_request (
  requester_assignment_id,
  approver_assignment_id
)
WHERE status = 'pending';