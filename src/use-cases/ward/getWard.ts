import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { WardRepository } from '@service/domain/repositories/ward.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardMemberRepository } from '@service/domain/repositories/wardMember.repository'

export const getAllWardInHospital = async (
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        wardRepo: WardRepository
        userRepo: UserRepository
        wardMemberRepo: WardMemberRepository
    }
) => {
    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // ward ทั้งหมดใน hospital ที่ user นี้อยู่
    const allWardRecords = await repos.wardRepo.findByHospitalId(currentUser.hospitalId!)

    const result = await Promise.all(
        allWardRecords.map(async (record) => {
            // หา user เจ้าของ ward
            const wardOwner = await repos.userRepo.findById(record.createdBy)
            if (!wardOwner) {
                logger.error('Ward owner not found')
                throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
            }

            // นับจำนวนคนใน ward 
            const wardMembers = await repos.wardMemberRepo.findByWardId(record.wardId)

            return {
                wardId: record.wardId,
                wardName: record.wardName,
                member: wardMembers.length,
                createdBy: `${wardOwner.firstName} ${wardOwner.lastName}`,
            }
        })
    );

    return result
}

export const getWardById = async (
    wardId: string,
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        wardRepo: WardRepository,
        userRepo: UserRepository,
    }
) => {
    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // ward ทั้งหมดใน hospital ที่ user นี้อยู่
    const wardData = await repos.wardRepo.findById(wardId)
    if (!wardData) {
        logger.error('Ward not found')
        throw throwCustomError(ErrorDescription.WARD_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา ward owner
    const wardOwner = await repos.userRepo.findById(wardData.createdBy)
    if (!wardOwner) {
        logger.error('Ward owner not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    const result = {
        wardId: wardData.wardId,
        wardName: wardData.wardName,
        hospitalId: wardData.hospitalId,
        joinCode: wardData.joinCode,
        joinCodeStatus: wardData.joinCodeStatus,
        status: wardData.status,
        createdBy: `${wardOwner.firstName} ${wardOwner.lastName}`,
        updatedBy: `${wardOwner.firstName} ${wardOwner.lastName}`,
    }

    return result
}