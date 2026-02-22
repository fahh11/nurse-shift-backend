import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { HospitalRepository } from '@service/domain/repositories/hospital.repository'


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