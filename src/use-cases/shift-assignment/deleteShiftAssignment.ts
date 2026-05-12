import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardRepository } from '@service/domain/repositories/ward.repository'
import { WardMemberRepository } from '@service/domain/repositories/wardMember.repository'
import { WardMemberRole } from '@service/enums/wardMemberRole'

export const deleteShiftAssignment = async (
    shiftAssignmentId: string,
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        shiftAssignmentRepo: ShiftAssignmentRepository
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

    // หา shift assignment ที่ต้องการลบ
    const shiftAssignmentData = await repos.shiftAssignmentRepo.findById(shiftAssignmentId)
    if (!shiftAssignmentData) {
        console.log('Shift assignment not found')
        throw throwCustomError(ErrorDescription.SHIFT_ASSIGNMENT_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา ward
    const wardData = await repos.wardRepo.findById(shiftAssignmentData.wardId)
    if (!wardData) {
        console.log('Ward not found')
        throw throwCustomError(ErrorDescription.WARD_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา ward member
    const wardMemberDate = await repos.wardMemberRepo.findByUserIdAndWardId(currentUser.userId, wardData.wardId)
    if (!wardMemberDate) {
        console.log('Ward member not found')
        throw throwCustomError(ErrorDescription.WARD_MEMBER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // delete ได้ต้องเป็น head_nurse เท่านั้น
    if (wardMemberDate.role !== WardMemberRole.HEAD_NURSE) {
        console.log('Ward access denied')
        throw throwCustomError(ErrorDescription.WARD_ACCESS_DENIED, StatusCode.FORBIDDEN_403)
    }

    // ======= Soft Delete =======
    shiftAssignmentData.update({
        deletedAt: new Date(),
        updatedBy: currentUser.userId
    })
    const updated = await repos.shiftAssignmentRepo.update(shiftAssignmentData)

    return updated
}