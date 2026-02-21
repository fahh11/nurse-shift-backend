import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { Hospital } from '@service/domain/entities/hospital'
import { CreateHospitalBody } from '@service/types/hospital.type'
import { CreateHospitalOutputDto } from '@service/interfaces/dto/hospital/hospital.output'
import { HospitalRepository } from '@service/domain/repositories/hospital.repository'

export const createHospital = async (
    input: CreateHospitalBody,
    logger: FastifyInstance['log'],
    repos: {
        hospitalRepo: HospitalRepository,
    }
): Promise<CreateHospitalOutputDto> => {
    // create hospital
    const newHospital = new Hospital({
        name: input.name,
        address: input.address,
    })

    const result = await repos.hospitalRepo.create(newHospital);
    return result
}