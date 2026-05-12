import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { formatDate } from 'date-fns'
import { ShiftSwapRequestRepository } from '@service/domain/repositories/shiftSwapRequest.repository'
import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardRepository } from '@service/domain/repositories/ward.repository'
import { WardMemberRepository } from '@service/domain/repositories/wardMember.repository'
import { ShiftSwapRequestStatus } from '@service/enums/shiftSwapRequestStatus'

export const getAllShiftSwapRequest = async (
    userId: string,
    wardId: string,
    logger: FastifyInstance['log'],
    repos: {
        shiftSwapRequestRepo: ShiftSwapRequestRepository
        shiftAssignmentRepo: ShiftAssignmentRepository
        shiftTemplateRepo: ShiftTemplateRepository
        userRepo: UserRepository
        wardRepo: WardRepository
        wardMemberRepo: WardMemberRepository
    }
) => {
    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)

    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา ward
    const wardData = await repos.wardRepo.findById(wardId)

    if (!wardData) {
        logger.error('Ward not found')
        throw throwCustomError(ErrorDescription.WARD_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หาข้อมูลของ ward member ของ user นี้
    const wardMemberData = await repos.wardMemberRepo.findByUserIdAndWardId(currentUser.userId, wardData.wardId)

    if (!wardMemberData) {
        logger.error('You do not have permission to access this ward')
        throw throwCustomError(ErrorDescription.WARD_ACCESS_DENIED, StatusCode.FORBIDDEN_403)
    }

    // หา shift template ของ ward นี้
    const allShiftTemplate = await repos.shiftTemplateRepo.findByWardId(wardData.wardId)

    if (!allShiftTemplate) {
        logger.error('Shift template not found')
        throw throwCustomError(ErrorDescription.SHIFT_TEMPLATE_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา shift swap record ทั้งหมดใน ward
    const allShiftSwapInWard = await repos.shiftSwapRequestRepo.findByWardId(wardData.wardId)

    // กรองเฉพาะที่มี status pending
    const approvedSwaps = allShiftSwapInWard.filter(
        record => record.status === ShiftSwapRequestStatus.APPROVED
    )

    const result = await Promise.all(
        approvedSwaps.map(async (record) => {
            // หา user
            const requester = await repos.userRepo.findById(record.requesterUserId)
            const approver = await repos.userRepo.findById(record.approverUserId)

            if (!requester || !approver) {
                logger.error('User not found')
                throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
            }

            // หา assignment
            const requesterAssignment = await repos.shiftAssignmentRepo.findById(record.requesterAssignmentId)
            const approverAssignment = await repos.shiftAssignmentRepo.findById(record.approverAssignmentId)

            if (!requesterAssignment || !approverAssignment) {
                logger.error('Shift assignment not found')
                throw throwCustomError(ErrorDescription.SHIFT_ASSIGNMENT_NOT_FOUND, StatusCode.NOT_FOUND_404)
            }

            const requesterAssignmentDateFormat = formatDate(
                requesterAssignment.date,
                'dd-MM-yyyy'
            )
            
            const approverAssignmentDateFormat = formatDate(
                approverAssignment.date,
                'dd-MM-yyyy'
            )

            // หา template
            const requesterTemplate = allShiftTemplate.find(
                template =>
                    template.shiftTemplateId ===
                    requesterAssignment.shiftTemplateId
            )

            const approverTemplate = allShiftTemplate.find(
                template =>
                    template.shiftTemplateId ===
                    approverAssignment.shiftTemplateId
            )
           
            return {
                requesterName: `${requester.firstName} ${requester.lastName}`,
                approverName:`${approver.firstName} ${approver.lastName}`,
                requesterAssignmentDate: requesterAssignmentDateFormat,
                approverAssignmentDate: approverAssignmentDateFormat,
                requesterAssignmentType: requesterAssignment.assignmentType,
                approverAssignmentType: approverAssignment.assignmentType,
                requesterTemplateType: requesterTemplate?.type,
                approverTemplateType: approverTemplate?.type,
                status: record.status,
            }
        })
    );

    return result
}