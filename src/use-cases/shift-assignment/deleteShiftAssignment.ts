import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'

export const getSummaryMonthShiftAssignment = async (
    shiftAssignmentId: string,
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        shiftAssignmentRepo: ShiftAssignmentRepository
        userRepo: UserRepository
    }
) => {
    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }
}