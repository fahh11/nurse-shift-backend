import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { HospitalRepository } from '@service/domain/repositories/hospital.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'


export const getAllHospital = async (
    logger: FastifyInstance['log'],
    repos: {
        hospitalRepo: HospitalRepository
    }
) => {
    // หา hospital ทั้งหมด
    const allHospitalRecord = await repos.hospitalRepo.findAll()

    const result = await Promise.all(
        allHospitalRecord.map(async (record) => {
            return {
                hospitalId: record.hospitalId,
                name: record.name,
            };
        })
    );

    return result
}

export const getUserHospital = async (
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        hospitalRepo: HospitalRepository
        userRepo: UserRepository
    }
) => {
    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา hospital ที่ user อยู่
    const hospitalData = await repos.hospitalRepo.findById(currentUser.hospitalId!)
    if (!hospitalData) {
        logger.error('Hospital not found')
        throw throwCustomError(
            ErrorDescription.HOSPITAL_NOT_FOUND,
            StatusCode.NOT_FOUND_404
        )
    }

    const result = {
        hospitalId: hospitalData.hospitalId,
        name: hospitalData.name
    }

    return result
}