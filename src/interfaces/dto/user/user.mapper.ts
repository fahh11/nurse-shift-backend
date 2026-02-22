import { User } from '@service/domain/entities/user'
import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription} from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { UpdateUserForCompleteProfileOutputDto } from '@service/interfaces/dto/user/user.output'
import { UpdateUserOutputDto } from '@service/interfaces/dto/user/user.output'

export const mapToCompleteProfileOutputDto = (
    user: User,
    logger: FastifyInstance['log']
): UpdateUserForCompleteProfileOutputDto => {

    if (
        !user.firstName ||
        !user.lastName ||
        // TODO: ยังไม่เอา line id
        !user.hospitalId
    ) {
        logger.error(`Profile marked as completed but required fields are null.`)
        throw throwCustomError(
            ErrorDescription.PROFILE_INFORMATION_INCOMPLETE,
            StatusCode.INTERNAL_SERVER_ERROR_500
        )
    }

    return {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        personalEmail: user.personalEmail,
        googleEmailId: user.googleEmailId,
        lineUserId: user.lineUserId,
        hospitalId: user.hospitalId,
        profileCompleted: user.profileCompleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
}

export const mapToUpdateUserOutputDto = (
    user: User
): UpdateUserOutputDto => {
    return {
        // TODO: เอาจจะต้องแก้ !
        userId: user.userId,
        firstName: user.firstName!,
        lastName: user.lastName!,
        personalEmail: user.personalEmail,
        googleEmailId: user.googleEmailId,
        lineUserId: user.lineUserId!,
        hospitalId: user.hospitalId!,
        profileCompleted: user.profileCompleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
}

