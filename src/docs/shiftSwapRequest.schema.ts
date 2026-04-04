import { ShiftSwapRequestStatus } from '@service/generated/prisma/enums';

const tags = ['ShiftSwapRequest'];

export const createShiftSwapRequestSchema = {
    description: 'Create a new shift swap request record',
    tags,
    body: {
//         shift_swap_request_id         String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   requester_user_id             String            @db.Uuid
//   approver_user_id              String            @db.Uuid
//   requester_assignment_id       String            @db.Uuid
//   approver_assignment_id        String            @db.Uuid
//   status                        ShiftSwapRequestStatus
//   note                          String            @db.VarChar(255)
//   requested_at                      DateTime          @default(now()) @db.Timestamp(6)
//   responded_at  
        type: 'object',
        required: ['requester_user_id', 'approver_user_id', 'requester_assignment_id', 'approver_assignment_id'],
        properties: {
            requester_user_id: { type: 'string' },
            approver_user_id: { type: 'string' },
            requester_assignment_id: { type: 'string' },
            approver_assignment_id: { type: 'string' },
        },
    },
    response: {
        200: {
        },
    },
};