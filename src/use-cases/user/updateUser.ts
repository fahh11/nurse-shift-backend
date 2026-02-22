import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { UpdateUserForCompleteProfileBody } from '@service/types/user.type'
import { UpdateUserBody } from '@service/types/user.type'
import { UpdateUserForCompleteProfileOutputDto } from '@service/interfaces/dto/user/user.output'
import { UpdateUserOutputDto } from '@service/interfaces/dto/user/user.output'
import { mapToCompleteProfileOutputDto, mapToUpdateUserOutputDto } from '@service/interfaces/dto/user/user.mapper'


export const updateUserForCompleteProfile = async (
    input: UpdateUserForCompleteProfileBody,
    logger: FastifyInstance['log'],
    repos: {
        userRepo: UserRepository,
    }
): Promise<UpdateUserForCompleteProfileOutputDto> => {
    // หา user จาก personal email
    const existingUser = await repos.userRepo.findByPersonalEmail(input.email)
    if (!existingUser) {
        logger.error(`User not found.`)
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // validate input (business rule)
    if (
        !input.firstName ||
        !input.lastName ||
        !input.hospitalId
    ) {
        logger.error(`Profile information incomplete.`)
        throw throwCustomError(
            ErrorDescription.PROFILE_INFORMATION_INCOMPLETE,
            StatusCode.BAD_REQUEST_400
        )
    }

    // update domain entity
    existingUser.update({
        firstName: input.firstName.toLowerCase(),
        lastName: input.lastName.toLowerCase(),
        // TODO: ยังไม่เพิ่ม line
        lineUserId: randomUUID(),
        hospitalId: input.hospitalId,
        profileCompleted: true,
    })

    const updatedUser = await repos.userRepo.update(existingUser)
    return mapToCompleteProfileOutputDto(updatedUser, logger)
}

export const updateUser = async (
    input: UpdateUserBody,
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        userRepo: UserRepository,
    }
): Promise<UpdateUserOutputDto> => {
    // หา user จาก personal email
    const existingUser = await repos.userRepo.findById(userId)
    if (!existingUser) {
        logger.error(`User not found.`)
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // update domain entity
    existingUser.update({
        firstName: input.firstName?.toLowerCase(),
        lastName: input.lastName?.toLowerCase(),
        lineUserId: input.lineUserId,
        hospitalId: input.hospitalId,
    })

    const updatedUser = await repos.userRepo.update(existingUser)
    return mapToUpdateUserOutputDto(updatedUser)
}