import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { UserRepository } from '@service/domain/repositories/user.repository'

export const getMe = async (
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        userRepo: UserRepository,
    }
) => {
    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    const result = {
        userId: currentUser.userId,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        personalEmail: currentUser.personalEmail,
        lineUserId: currentUser.lineUserId,
        hospitalId: currentUser.hospitalId,
        profileCompleted: currentUser.profileCompleted,
    }

    return result
}
