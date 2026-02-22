import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { WardMemberRepository } from '@service/domain/repositories/wardMember.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'

export const getAllWardMemberInWard = async(
    wardId: string,
    logger: FastifyInstance['log'],
    repos: {
        wardMemberRepo: WardMemberRepository
        userRepo: UserRepository
    }
) => {
    // หา ward_member ทั้งหมดใน ward
    const allWardMemberRecord = await repos.wardMemberRepo.findByWardId(wardId)

    const result = await Promise.all(
        allWardMemberRecord.map(async (record) => {
            // หา user ที่เป็น member
            const member = await repos.userRepo.findById(record.userId)
            if (!member) {
                logger.error('This member not found')
                throw throwCustomError(
                    ErrorDescription.USER_NOT_FOUND,
                    StatusCode.NOT_FOUND_404
                );
            }

            return {
                firstName: member.firstName,
                lastName: member.lastName,
            };
        })
    );

    return result
}