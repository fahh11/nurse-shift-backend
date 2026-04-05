import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import crypto from 'crypto'
import { UserRepository } from '@service/domain/repositories/user.repository'

export const lineConnect = async(
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        userRepo: UserRepository

    }
) => {
    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)

    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // สร้าง token
    const token = crypto.randomUUID()

    // expire ใน 10 นาที
    const expire = new Date(Date.now() + 10 * 60 * 1000)

    // ======= update user =======
    currentUser.update({
        lineLinkToken: token,
        lineLinkTokenExpire: expire,
    })
    await repos.userRepo.update(currentUser)

    return {
        addLineUrl: `https://line.me/R/ti/p/@541nhvwk?register=${token}`,
        token: token,
    }
}