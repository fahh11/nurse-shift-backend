// import { FastifyInstance } from 'fastify'
// import { throwCustomError, ErrorDescription } from '@service/helpers/error'
// import { StatusCode } from '@service/enums/statusCode'
// import { ShiftAssignment } from '@service/domain/entities/shiftAssignment'
// import { CreateShiftAssignmentBody } from '@service/types/shiftAssignment.type'
// import { CreateShiftAssignmentOutputDto } from '@service/interfaces/dto/shift-assignment/shiftAssignment.output'
// import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
// import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
// import { UserRepository } from '@service/domain/repositories/user.repository'
// import { WardRepository } from '@service/domain/repositories/ward.repository'


// export const createShiftRequirement = async(
//     input: CreateShiftAssignmentBody,
//     shiftTemplateId: string,
//     userId: string,
//     logger: FastifyInstance['log'],
//     repos: {
//         shiftAssignmentRepo: ShiftAssignmentRepository
//         shiftTemplateRepo: ShiftTemplateRepository
//         userRepo: UserRepository
//         wardRepo: WardRepository
//     }
// ): Promise<CreateShiftAssignmentOutputDto> =>{
//     // หา user ปัจจุบันจาก id
//     const currentUser = await repos.userRepo.findById(userId)
//     if (!currentUser) {
//         logger.error('User not found')
//         throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
//     }

//     // หา shift_template ที่ต้องการ
//     const shiftTemplateData = await repos.shiftTemplateRepo.findById(shiftTemplateId)
//     if (!shiftTemplateData) {
//         logger.error('Shift template not found')
//         throw throwCustomError(ErrorDescription.SHIFT_TEMPLATE_NOT_FOUND, StatusCode.NOT_FOUND_404)
//     }

//     // หา ward 
//     const wardData = await repos.wardRepo.findById(shiftTemplateData.wardId)
//     if (!wardData) {
//         logger.error('Ward not found')
//         throw throwCustomError(ErrorDescription.WARD_NOT_FOUND, StatusCode.NOT_FOUND_404)
//     }

//     // user ที่ถูก assign ต้องเป็นสมาชิกใน ward นั้น
//     if ()

//     // create shift assignment
//     const newShiftAssignment = new ShiftAssignment({
//         shiftTemplateId: shiftTemplateId,
//         userId: currentUser.userId,
//         date: input.date,
//         assignmentType: input.assignmentType
//     })
    
//     const result = await repos.hospitalRepo.create(newHospital);
//     return result
// }