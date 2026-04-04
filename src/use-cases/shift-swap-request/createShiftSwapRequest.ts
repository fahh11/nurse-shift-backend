// import { FastifyInstance } from 'fastify'
// import { throwCustomError, ErrorDescription } from '@service/helpers/error'
// import { StatusCode } from '@service/enums/statusCode'
// import { ShiftSwapRequestRepository } from '@service/domain/repositories/shiftSwapRequest.repository'
// import { UserRepository } from '@service/domain/repositories/user.repository'
// import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
// import { CreateShiftSwapRequestBody } from '@service/types/shiftSwapRequest.type'
// import { CreateShiftSwapRequestOutputDto } from '@service/interfaces/dto/shift-swap-request/shiftSwapRequest.output'

// export const createShiftAssignment = async(
//     input: CreateShiftSwapRequestBody,
//     userId: string,
//     logger: FastifyInstance['log'],
//     repos: {
//         shiftSwapRequestRepo: ShiftSwapRequestRepository
//         userRepo: UserRepository
//     }
// ): Promise<CreateShiftSwapRequestOutputDto> => {
//     // ======= Load once =======

//     // หา user ปัจจุบันจาก id
//     const currentUser = await repos.userRepo.findById(userId)
//     if (!currentUser) {
//         logger.error('User not found')
//         throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
//     }

//     // หา shift assignment ที่ต้องการแลกและถูกแลก
//     const requestAssignment
// }