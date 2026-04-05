import { PrismaClient } from '@prisma/client';
import { ShiftSwapRequest } from '@service/domain/entities/shiftSwapRequest';
import { ShiftSwapRequestRepository } from '@service/domain/repositories/shiftSwapRequest.repository';
import { ShiftSwapRequestStatus } from '@service/enums/shiftSwapRequestStatus';

const prisma = new PrismaClient();

export class PrismaShiftSwapRequestRepository implements ShiftSwapRequestRepository {
    async create(shiftSwapRequest: ShiftSwapRequest): Promise<ShiftSwapRequest> {
        const created = await prisma.shift_swap_request.create({
            data: {
                requester_user_id: shiftSwapRequest.requesterUserId,
                approver_user_id: shiftSwapRequest.approverUserId,
                requester_assignment_id: shiftSwapRequest.requesterAssignmentId,
                approver_assignment_id: shiftSwapRequest.approverAssignmentId,
                status: shiftSwapRequest.status,
                note: shiftSwapRequest.note ?? null,
            }
        })

        return new ShiftSwapRequest({
            shiftSwapRequestId: created.shift_swap_request_id,
            requesterUserId: created.requester_user_id,
            approverUserId: created.approver_user_id,
            requesterAssignmentId: created.requester_assignment_id,
            approverAssignmentId: created.approver_assignment_id,
            status: created.status as ShiftSwapRequestStatus,
            note: created.note,
            requestedAt: created.requested_at,
            respondedAt: created.responded_at,
        })
    }

    async findById(shiftSwapRequestId: string): Promise<ShiftSwapRequest | null> {
        const shiftSwapRequest = await prisma.shift_swap_request.findUnique({
            where: { shift_swap_request_id: shiftSwapRequestId }
        })

        return shiftSwapRequest
        ? new ShiftSwapRequest({
            shiftSwapRequestId: shiftSwapRequest.shift_swap_request_id,
            requesterUserId: shiftSwapRequest.requester_user_id,
            approverUserId: shiftSwapRequest.approver_user_id,
            requesterAssignmentId: shiftSwapRequest.requester_assignment_id,
            approverAssignmentId: shiftSwapRequest.approver_assignment_id,
            status: shiftSwapRequest.status as ShiftSwapRequestStatus,
            note: shiftSwapRequest.note,
            requestedAt: shiftSwapRequest.requested_at,
            respondedAt: shiftSwapRequest.responded_at,
        }) : null
    }

    async findByWardId(wardId: string): Promise<ShiftSwapRequest[]> {
        const shiftSwapRequests = await prisma.shift_swap_request.findMany({
            where: {
                OR: [
                    {
                        requesterAssignment: { ward_id: wardId },
                    },
                    {
                        approverAssignment: { ward_id: wardId },
                    },
                ],
            },
        })

        return shiftSwapRequests.map(
            (shiftSwapRequest) =>
                new ShiftSwapRequest({
                    shiftSwapRequestId: shiftSwapRequest.shift_swap_request_id,
                    requesterUserId: shiftSwapRequest.requester_user_id,
                    approverUserId: shiftSwapRequest.approver_user_id,
                    requesterAssignmentId: shiftSwapRequest.requester_assignment_id,
                    approverAssignmentId: shiftSwapRequest.approver_assignment_id,
                    status: shiftSwapRequest.status as ShiftSwapRequestStatus,
                    note: shiftSwapRequest.note,
                    requestedAt: shiftSwapRequest.requested_at,
                    respondedAt: shiftSwapRequest.responded_at,
                })
        )
    }

    async findByShiftAssignmentId(shiftAssignmentId: string): Promise<ShiftSwapRequest[]> {
        const shiftSwapRequests = await prisma.shift_swap_request.findMany({
            where: {
                OR: [
                    { requester_assignment_id: shiftAssignmentId },
                    { approver_assignment_id: shiftAssignmentId }
                ],
            },
        })

        return shiftSwapRequests.map(
            (shiftSwapRequest) =>
                new ShiftSwapRequest({
                    shiftSwapRequestId: shiftSwapRequest.shift_swap_request_id,
                    requesterUserId: shiftSwapRequest.requester_user_id,
                    approverUserId: shiftSwapRequest.approver_user_id,
                    requesterAssignmentId: shiftSwapRequest.requester_assignment_id,
                    approverAssignmentId: shiftSwapRequest.approver_assignment_id,
                    status: shiftSwapRequest.status as ShiftSwapRequestStatus,
                    note: shiftSwapRequest.note,
                    requestedAt: shiftSwapRequest.requested_at,
                    respondedAt: shiftSwapRequest.responded_at,
                })
        )
    }

    async findAll(): Promise<ShiftSwapRequest[]> {
        const shiftSwapRequests = await prisma.shift_swap_request.findMany({})

        return shiftSwapRequests.map(
            (shiftSwapRequest) =>
                new ShiftSwapRequest({
                    shiftSwapRequestId: shiftSwapRequest.shift_swap_request_id,
                    requesterUserId: shiftSwapRequest.requester_user_id,
                    approverUserId: shiftSwapRequest.approver_user_id,
                    requesterAssignmentId: shiftSwapRequest.requester_assignment_id,
                    approverAssignmentId: shiftSwapRequest.approver_assignment_id,
                    status: shiftSwapRequest.status as ShiftSwapRequestStatus,
                    note: shiftSwapRequest.note,
                    requestedAt: shiftSwapRequest.requested_at,
                    respondedAt: shiftSwapRequest.responded_at,
                })
        )
    }

    async update(shiftSwapRequest: ShiftSwapRequest): Promise<ShiftSwapRequest> {
        const updated = await prisma.shift_swap_request.update({
            where: { shift_swap_request_id: shiftSwapRequest.shiftSwapRequestId },
            data: {
                status: shiftSwapRequest.status,
                note: shiftSwapRequest.note,
                responded_at: new Date(),
            }
        })

        return new ShiftSwapRequest({
            shiftSwapRequestId: updated.shift_swap_request_id,
            requesterUserId: updated.requester_user_id,
            approverUserId: updated.approver_user_id,
            requesterAssignmentId: updated.requester_assignment_id,
            approverAssignmentId: updated.approver_assignment_id,
            status: updated.status as ShiftSwapRequestStatus,
            note: updated.note,
            requestedAt: updated.requested_at,
            respondedAt: updated.responded_at,
        })
    }

    async delete(shiftSwapRequestId: string): Promise<void> {
        await prisma.shift_swap_request.delete({
            where: { shift_swap_request_id: shiftSwapRequestId }
        })
    }
}