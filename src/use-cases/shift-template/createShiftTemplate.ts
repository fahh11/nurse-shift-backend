import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftTemplate } from '@service/domain/entities/shiftTemplate'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardRepository } from '@service/domain/repositories/ward.repository'
import { CreateShiftTemplateBody } from '@service/types/shiftTemplate.type'
import { CreateShiftTemplateOutputDto } from '@service/interfaces/dto/shift-template/shiftTemplate.output'
import { toMinutes } from '@service/helpers/shiftTemplate'

export const createShiftTemplate = async(
    input: CreateShiftTemplateBody,
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        shiftTemplateRepo: ShiftTemplateRepository
        userRepo: UserRepository
        wardRepo: WardRepository
    }
): Promise<CreateShiftTemplateOutputDto> =>{
    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา ward ที่ต้องการสร้าง shift_template
    const wardData = await repos.wardRepo.findById(input.wardId)
    if (!wardData) {
        logger.error('Ward not found')
        throw throwCustomError(
            ErrorDescription.WARD_NOT_FOUND,
            StatusCode.NOT_FOUND_404
        )
    }

    // user ที่สร้าง shift_template ต้องเป็นเจ้าของ ward ด้วย
    if (currentUser.userId !== wardData.createdBy) {
        logger.error('User is not the owner of this ward')
        throw throwCustomError(
            ErrorDescription.WARD_ACCESS_DENIED,
            StatusCode.FORBIDDEN_403
        )
    }

    // shift_template ใน ward นี้
    const allShiftTemplateInWard = await repos.shiftTemplateRepo.findByWardId(wardData.wardId)

    // shift_template ที่ีมีใน ward ต้องไม่เกินสาม
    if (allShiftTemplateInWard.length >= 3) {
        logger.error('Shift template limit exceeded in this ward')
        throw throwCustomError(
            ErrorDescription.SHIFT_TEMPLATE_LIMIT_EXCEEDED,
            StatusCode.BAD_REQUEST_400
        )
    }

    // shift_template type สร้างต้องไม่ซ้ำกับที่ีมีใน ward 
    const isDuplicateType = allShiftTemplateInWard.some(
        (template) => template.type === input.type
    )

    if (isDuplicateType) {
        logger.error('Shift template type already exists in this ward')
        throw throwCustomError(
            ErrorDescription.SHIFT_TEMPLATE_TYPE_DUPLICATE,
            StatusCode.BAD_REQUEST_400
        )
    }

    // เวลา start - end ต้องไม่ทับกับที่มีอยู่
    const newStart = toMinutes(input.startTime)
    const newEnd = toMinutes(input.endTime)

    const isTimeOverlap = allShiftTemplateInWard.some((template) => {
    const existingStart = toMinutes(template.startTime)
    const existingEnd = toMinutes(template.endTime)

    return newStart < existingEnd && newEnd > existingStart
    })

    if (isTimeOverlap) {
        logger.error(
            {
                wardId: input.wardId,
                startTime: input.startTime,
                endTime: input.endTime,
            },
            'Shift template time overlaps with existing shift'
        )

        throw throwCustomError(
            ErrorDescription.SHIFT_TEMPLATE_TIME_OVERLAP,
            StatusCode.BAD_REQUEST_400
        )
    }

    // create shift template
    const newShiftTemplate = new ShiftTemplate({
        wardId: input.wardId,
        type: input.type,
        startTime: input.startTime,
        endTime: input.endTime,
    })

    const result = await repos.shiftTemplateRepo.create(newShiftTemplate)
    return result
}