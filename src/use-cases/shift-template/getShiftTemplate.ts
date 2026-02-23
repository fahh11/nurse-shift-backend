import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { ShiftRequirementRepository } from '@service/domain/repositories/shiftRequirement.repository'

export const getAllShiftTemplateInWard = async (
    wardId: string,
    logger: FastifyInstance['log'],
    repos: {
        shiftTemplateRepo: ShiftTemplateRepository
        shiftRequirementRepo: ShiftRequirementRepository
    }
) => {
    // หา shift_template ทั้งหมดใน ward นี้
    const allShiftTemplateRecords = await repos.shiftTemplateRepo.findByWardId(wardId)


    const result = await Promise.all(
        allShiftTemplateRecords.map(async (record) => {
            // หาจำนวนคนที่ต้องการ ของ shift_template นั้น
            const shiftRequirementData = await repos.shiftRequirementRepo.findActiveByShiftTemplateId(record.shiftTemplateId)
            if (!shiftRequirementData) {
                logger.error('')
                throw throwCustomError(
                    ErrorDescription.SHIFT_REQUIREMENT_NOT_FOUND,
                    StatusCode.NOT_FOUND_404,
                )
            }
            return {
                shitfTemplateId: record.shiftTemplateId,
                wardId: record.wardId,
                type: record.type,
                startTime: record.startTime,
                endTime: record.endTime,
                requiredPeople: shiftRequirementData.requiredPeople,
            }
        })
    );

    return result
}