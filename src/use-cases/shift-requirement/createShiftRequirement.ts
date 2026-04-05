import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftRequirement } from '@service/domain/entities/shiftRequirement'
import { CreateShiftRequirementBody } from '@service/types/shiftRequirement.type'
import { CreateShiftRequirementOutputDto } from '@service/interfaces/dto/shift-requirement/shiftRequirement.output'
import { ShiftRequirementRepository } from '@service/domain/repositories/shiftRequirement.repository'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardRepository } from '@service/domain/repositories/ward.repository'

export const createShiftRequirement = async(
    input: CreateShiftRequirementBody,
    shiftTemplateId: string,
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        shiftRequirementRepo: ShiftRequirementRepository
        shiftTemplateRepo: ShiftTemplateRepository
        userRepo: UserRepository
        wardRepo: WardRepository
    }
): Promise<CreateShiftRequirementOutputDto> =>{
    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา shift_template
    const shiftTemplateData = await repos.shiftTemplateRepo.findById(shiftTemplateId)
    if (!shiftTemplateData) {
        logger.error('Shift template not found')
        throw throwCustomError(ErrorDescription.SHIFT_TEMPLATE_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา ward 
    const wardData = await repos.wardRepo.findById(shiftTemplateData.wardId)
    if (!wardData) {
        logger.error('Ward not found')
        throw throwCustomError(ErrorDescription.WARD_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // user ที่แก้ไขต้องเป็นคนสร้าง ward นี้
    if (currentUser.userId !== wardData.createdBy) {
        logger.error('You do not have permission to access this ward')
        throw throwCustomError(ErrorDescription.WARD_ACCESS_DENIED, StatusCode.FORBIDDEN_403)
    }

    // วันที่เริ่มใช้ของ requirement ใหม่
    const today = new Date(new Date().toISOString().split('T')[0])

    // 1. หา requirement ล่าสุดของ shiftTemplateId นี้
    const latestRequirement = await repos.shiftRequirementRepo.findActiveByShiftTemplateId(
        shiftTemplateId
    )

    // 2. ถ้ามีตัวเก่า → ปิดมัน
    if (latestRequirement && !latestRequirement.effectiveTo) {
        latestRequirement.update({
            effectiveTo: today
        })

        await repos.shiftRequirementRepo.update(latestRequirement)
    }

    // create shift requirement
    const newShiftRequirement = new ShiftRequirement({
        shiftTemplateId: shiftTemplateId,
        requiredPeople: input.requiredPeople,
        effectiveFrom: today,
        effectiveTo: null,
    })

    const result = await repos.shiftRequirementRepo.create(newShiftRequirement)
    return result
}