import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { Ward } from '@service/domain/entities/ward'
import { WardMember } from '@service/domain/entities/wardMember'
import { WardRepository } from '@service/domain/repositories/ward.repository'
import { WardStatus } from '@service/enums/wardStatus'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardMemberRepository } from '@service/domain/repositories/wardMember.repository'
import { WardMemberRole } from '@service/enums/wardMemberRole'
import { CreateWardBody } from '@service/types/ward.type'
import { CreateWardOutputDto } from '@service/interfaces/dto/ward/ward.output'
import { generateJoinCode } from '@service/helpers/ward'
import { isUniqueConstraintError } from '@service/helpers/dbErrorHelper'

const MAX_RETRY = 5

export const createWard = async (
    input: CreateWardBody,
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        wardRepo: WardRepository
        userRepo: UserRepository
        wardMemberRepo: WardMemberRepository
    }
): Promise<CreateWardOutputDto> => {
    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // user ต้องมี hospital ที่อยู่
    if (!currentUser.hospitalId) {
        logger.error('User has no hospital')
        throw throwCustomError(
            ErrorDescription.PROFILE_NOT_COMPLETED,
            StatusCode.BAD_REQUEST_400
        )
    }
    
    // Generate Join Code + Retry if collision
    let createdWard: CreateWardOutputDto | null = null
    let attempt = 0

    while (attempt < MAX_RETRY) {
        attempt++

        const joinCode = generateJoinCode(8)

        const newWard = new Ward({
            wardName: input.wardName,
            hospitalId: currentUser.hospitalId,
            joinCode,
            joinCodeStatus: true,
            status: WardStatus.ACTIVE,
            createdBy: currentUser.userId,
            updatedBy: currentUser.userId,
        })

        try {
            createdWard = await repos.wardRepo.create(newWard)
            break // ✅ สำเร็จ
        } catch (error: any) {

            // 🔁 ถ้า unique constraint (joinCode ชนซ้ำ)
            if (isUniqueConstraintError(error)) {
                logger.warn(
                    { joinCode, attempt },
                    'Join code collision, retrying...'
                )
                continue
            }

            // ❌ error อื่น ๆ
            logger.error(error, 'Create ward failed')
            throw error
        }
    }

    if (!createdWard) {
        logger.error('Failed to generate unique join code after max retries')
        throw throwCustomError(
            ErrorDescription.INTERNAL_SERVER_ERROR,
            StatusCode.INTERNAL_SERVER_ERROR_500
        )
    }

    // 🔥 สร้าง ward_member ให้ head_nurse
    const headNurse = new WardMember({
        userId: currentUser.userId,
        wardId: createdWard.wardId,
        role: WardMemberRole.HEAD_NURSE
    })

    await repos.wardMemberRepo.create(headNurse)

    return createdWard
}