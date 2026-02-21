import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { WardRepository } from '@service/domain/repositories/ward.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { UpdateWardBody } from '@service/types/ward.type'
import { UpdateWardOutputDto } from '@service/interfaces/dto/ward/ward.output'

export const updateWard = async (
    input: UpdateWardBody,
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        wardRepo: WardRepository,
        userRepo: UserRepository,
    }
): Promise<UpdateWardOutputDto> => {
    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา ward ที่ต้องการ update จาก id
    const wardData = await repos.wardRepo.findById(input.wardId)
    if (!wardData) {
        logger.error('Ward not found')
        throw throwCustomError(ErrorDescription.WARD_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // user ที่ update ต้องเป็น เจ้าของ ward
    if (wardData.createdBy !== currentUser.userId) {
        logger.error('Forbidden: user is not owner of ward')
        throw throwCustomError(
            ErrorDescription.WARD_ACCESS_DENIED,
            StatusCode.FORBIDDEN_403
        )
    }

    // update domain entity
    wardData.update({
        wardName: input.wardName,
        hospitalId: input.hospitalId,
        joinCodeStatus: input.joinCodeStatus,
        status: input.status
    })

    const result = await repos.wardRepo.update(wardData);
    return result
}