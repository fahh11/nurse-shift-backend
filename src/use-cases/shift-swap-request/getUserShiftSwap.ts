import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { formatDate } from 'date-fns'
import { ShiftSwapRequest } from '@service/domain/entities/shiftSwapRequest'
import { ShiftSwapRequestRepository } from '@service/domain/repositories/shiftSwapRequest.repository'
import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardRepository } from '@service/domain/repositories/ward.repository'
import { WardMemberRepository } from '@service/domain/repositories/wardMember.repository'
import { TargetForGetShiftSwap } from '@service/enums/targetForGetShiftSwap'

export const getUserShiftSwap = async (
    userId: string,
    wardId: string,
    target: TargetForGetShiftSwap,
    logger: FastifyInstance['log'],
    repos: {
        shiftSwapRequestRepo: ShiftSwapRequestRepository
        shiftAssignmentRepo: ShiftAssignmentRepository
        shiftTemplateRepo: ShiftTemplateRepository
        userRepo: UserRepository
        wardRepo: WardRepository
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

    // หา shift swap record ที่อยู่ใน ward นี้
    const allShiftSwapInWard = await repos.shiftSwapRequestRepo.findByWardId(wardData.wardId)

    let filterShiftSwap: ShiftSwapRequest[] = []

    // กรอง shift swap request ที่เราขอ
    if (target === TargetForGetShiftSwap.REQUEST) {
        filterShiftSwap = allShiftSwapInWard.filter(
            a => a.requesterUserId === currentUser.userId
        )
    }

    // กรอง shift swap request ที่ถูกขอ
    if (target === TargetForGetShiftSwap.RECEIVED) {
        filterShiftSwap = allShiftSwapInWard.filter(
            a => a.approverUserId === currentUser.userId
        )
    }

    const result = await Promise.all(
        filterShiftSwap.map(async (record) => {
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
            let requesterTemplate = null
            let approverTemplate =  null

            if (requesterAssignment.shiftTemplateId) {
                requesterTemplate = await repos.shiftTemplateRepo.findById(requesterAssignment.shiftTemplateId)
                if (!requesterTemplate) {
                    logger.error('Shift template not found')
                    throw throwCustomError(ErrorDescription.SHIFT_ASSIGNMENT_NOT_FOUND, StatusCode.NOT_FOUND_404)
                }
            }

            if (approverAssignment.shiftTemplateId) {
                approverTemplate = await repos.shiftTemplateRepo.findById(approverAssignment.shiftTemplateId)
                if (!approverTemplate) {
                    logger.error('Shift template not found')
                    throw throwCustomError(ErrorDescription.SHIFT_ASSIGNMENT_NOT_FOUND, StatusCode.NOT_FOUND_404)
                }
            }
           
            return {
                shiftSwapRequestId: record.shiftSwapRequestId,
                requesterName: `${requester.firstName} ${requester.lastName}`,
                requesterAssignmentDate: requesterAssignmentDateFormat,
                requesterAssignmentType: requesterAssignment.assignmentType,
                requesterTemplateType: requesterTemplate ? requesterTemplate.type : null,
                approverName: `${approver.firstName} ${approver.lastName}`,
                approverAssignmentDate: approverAssignmentDateFormat,
                approverAssignmentType: approverAssignment.assignmentType,
                approverTemplateType: approverTemplate ? approverTemplate.type : null,
                status: record.status,
                note: record.note,
            }
        })
    );

    return result
}