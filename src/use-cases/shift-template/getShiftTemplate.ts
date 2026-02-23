import { FastifyInstance } from 'fastify'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'

export const getAllShiftTemplateInWard = async (
    wardId: string,
    logger: FastifyInstance['log'],
    repos: {
        shiftTemplateRepo: ShiftTemplateRepository
    }
) => {
    // หา shift_template ทั้งหมดใน ward นี้
    const allShiftTemplateRecords = await repos.shiftTemplateRepo.findByWardId(wardId)

    const result = await Promise.all(
        allShiftTemplateRecords.map(async (record) => {
            return {
                shitfTemplateId: record.shiftTemplateId,
                wardId: record.wardId,
                type: record.type,
                startTime: record.startTime,
                endTime: record.endTime,
            }
        })
    );

    return result
}