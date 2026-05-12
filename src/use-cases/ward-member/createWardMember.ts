import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { WardMember } from '@service/domain/entities/wardMember'
import { WardMemberRole } from '@service/enums/wardMemberRole'
import { WardMemberRepository } from '@service/domain/repositories/wardMember.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardRepository } from '@service/domain/repositories/ward.repository'
import { CreateWardMemberBody } from '@service/types/wardMember.type'
import { CreateWardMemberOutputDto } from '@service/interfaces/dto/ward-member/wardMember.output'

export const createWardMember = async(
    input: CreateWardMemberBody,
    wardId: string,
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        wardMemberRepo: WardMemberRepository
        userRepo: UserRepository
        wardRepo: WardRepository
    }
): Promise<CreateWardMemberOutputDto> => {
    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(
            ErrorDescription.USER_NOT_FOUND,
            StatusCode.NOT_FOUND_404
        );
    }

    // หา ward ที่ต้องการเข้าร่วม
    const wardData = await repos.wardRepo.findById(wardId)
    if (!wardData) {
        logger.error('Ward not found')
        throw throwCustomError(
            ErrorDescription.WARD_NOT_FOUND,
            StatusCode.NOT_FOUND_404
        );
    }

    // ห้าม user เข้า ward เดิมซ้ำ
    const existingMember = await repos.wardMemberRepo.findByUserIdAndWardId(
        currentUser.userId,
        wardData.wardId
    );

    if (existingMember) {
        logger.error('Ward member already exists')
        throw throwCustomError(
            ErrorDescription.WARD_MEMBER_ALREADY_EXISTS,
            StatusCode.CONFLICT_409
        );
    }

    // user ต้องอยู่ในโรงพยาบาลที่ ward นั้นอยู่
    if (currentUser.hospitalId !== wardData.hospitalId) {
        logger.error('User does not belong to the hospital of this ward')
        throw throwCustomError(
            ErrorDescription.USER_NOT_IN_WARD_HOSPITAL,
            StatusCode.FORBIDDEN_403
        );
    }

    // check ว่า join code ที่ส่งมาตรงกับ join code ของ ward หรือไม่
    if (input.joinCode !== wardData.joinCode) {
        logger.error('Invalid ward join code')
        throw throwCustomError(
            ErrorDescription.INVALID_JOIN_CODE,
            StatusCode.BAD_REQUEST_400
        );
    }

    // check role
    const isHeadNurse = wardData.createdBy === currentUser.userId;

    const role = isHeadNurse
        ? WardMemberRole.HEAD_NURSE
        : WardMemberRole.NURSE;

    // create ward member
    const newWardMember = new WardMember({
        userId: currentUser.userId,
        wardId: wardData.wardId,
        role: role
    })

    const result = await repos.wardMemberRepo.create(newWardMember);
    return result
}