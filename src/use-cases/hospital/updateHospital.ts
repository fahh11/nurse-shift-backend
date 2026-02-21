import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { Hospital } from '@service/domain/entities/hospital'
import { UpdateHospitalBody } from '@service/types/hospital.type'
import { UpdateHospitalOutputDto } from '@service/interfaces/dto/hospital/hospital.output'
import { HospitalRepository } from '@service/domain/repositories/hospital.repository'

export const updateHospital = async (
    input: UpdateHospitalBody,
    logger: FastifyInstance['log'],
    repos: {
        hospitalRepo: HospitalRepository,
    }
): Promise<UpdateHospitalOutputDto> => {
    // หา hospital จาก id
    const existingHospital = await repos.hospitalRepo.findById(input.hospitalId)
    if (!existingHospital) {
        throw throwCustomError(ErrorDescription.HOSPITAL_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // 🔥 update
    existingHospital.update({
        name: input.name,
        address: input.address,
    })

    const result = await repos.hospitalRepo.update(existingHospital);
    return result
}