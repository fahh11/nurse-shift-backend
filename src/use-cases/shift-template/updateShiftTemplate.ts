import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftTemplate } from '@service/domain/entities/shiftTemplate'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardRepository } from '@service/domain/repositories/ward.repository'
import { UpdateShiftTemplateBody } from '@service/types/shiftTemplate.type'
import { UpdateShiftTemplateOutputDto } from '@service/interfaces/dto/shift-template/shiftTemplate.output'
import { toMinutes } from '@service/helpers/timeHelper'

export const updateShiftTemplate = async(
    input: UpdateShiftTemplateBody,
    shiftTemplateId: string,
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        shiftTemplateRepo: ShiftTemplateRepository
        userRepo: UserRepository
        wardRepo: WardRepository

    }
): Promise<UpdateShiftTemplateOutputDto> =>{
    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา shift_template ที่ต้องการ update
    const existingShiftTemplate = await repos.shiftTemplateRepo.findById(shiftTemplateId)
    if (!existingShiftTemplate) {
        logger.error('Shift template not found')
        throw throwCustomError(
            ErrorDescription.SHIFT_TEMPLATE_NOT_FOUND,
            StatusCode.NOT_FOUND_404
        )
    }

    // หา ward ของ shift_template นั้น
    const wardData = await repos.wardRepo.findById(existingShiftTemplate.wardId)
    if (!wardData) {
        logger.error('Ward not found')
        throw throwCustomError(
            ErrorDescription.WARD_NOT_FOUND,
            StatusCode.NOT_FOUND_404
        )
    }

    // user ที่ update shift_template ต้องเป็นเจ้าของ ward 
    if (currentUser.userId !== wardData.createdBy) {
        logger.error('User is not the owner of this ward')
        throw throwCustomError(
            ErrorDescription.WARD_ACCESS_DENIED,
            StatusCode.FORBIDDEN_403
        )
    }

    // หาทุก shift_template ที่มีใน ward
    const allShiftTemplateInWard = await repos.shiftTemplateRepo.findByWardId(wardData.wardId)

    // เวลา start - end ต้องไม่ทับกับที่มีอยู่
    const startTimeToUse = input.startTime ?? existingShiftTemplate.startTime
    const endTimeToUse = input.endTime ?? existingShiftTemplate.endTime

    const newStart = toMinutes(startTimeToUse)
    const newEnd = toMinutes(endTimeToUse)

    // ตัด template ตัวเองออกก่อน
    const otherTemplates = allShiftTemplateInWard.filter(
        t => t.shiftTemplateId !== existingShiftTemplate.shiftTemplateId
    )

    const isTimeOverlap = otherTemplates.some((template) => {
        const existingStart = toMinutes(template.startTime)
        const existingEnd = toMinutes(template.endTime)

        return newStart < existingEnd && newEnd > existingStart
    })

    if (isTimeOverlap) {
        logger.error(
            {
            wardId: wardData.wardId,
            startTime: startTimeToUse,
            endTime: endTimeToUse,
            },
            'Shift template time overlaps with existing shift'
        )

        throw throwCustomError(
            ErrorDescription.SHIFT_TEMPLATE_TIME_OVERLAP,
            StatusCode.BAD_REQUEST_400
        )
    }

    // update (ส่งเฉพาะ field ที่มีจริง)
    existingShiftTemplate.update({
        startTime: input.startTime ?? existingShiftTemplate.startTime,
        endTime: input.endTime ?? existingShiftTemplate.endTime,
    })

    const result = await repos.shiftTemplateRepo.update(existingShiftTemplate)
    return result
}