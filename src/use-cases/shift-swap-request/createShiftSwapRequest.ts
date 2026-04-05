import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftSwapRequest } from '@service/domain/entities/shiftSwapRequest'
import { ShiftSwapRequestRepository } from '@service/domain/repositories/shiftSwapRequest.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { CreateShiftSwapRequestBody } from '@service/types/shiftSwapRequest.type'
import { CreateShiftSwapRequestOutputDto } from '@service/interfaces/dto/shift-swap-request/shiftSwapRequest.output'
import { daysBetween } from '@service/helpers/timeHelper'
import { formatDate } from 'date-fns'
import { ShiftSwapRequestStatus } from '@service/enums/shiftSwapRequestStatus'

export const createShiftSwapRequest = async(
    input: CreateShiftSwapRequestBody,
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        shiftSwapRequestRepo: ShiftSwapRequestRepository
        userRepo: UserRepository
        shiftAssignmentRepo: ShiftAssignmentRepository
        shiftTemplateRepo: ShiftTemplateRepository
    },

    services: {
        lineService: {
            sendMessage: (id: string, msg: string) => Promise<void>
        }
    }
): Promise<CreateShiftSwapRequestOutputDto> => {
    // หา user ปัจจุบันและ approver จาก id
    const currentUser = await repos.userRepo.findById(userId)
    const approverUser = await repos.userRepo.findById(input.approverUserId)

    if (!currentUser || !approverUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา shift assignment ที่ต้องการแลกและถูกแลก
    const requesterAssignmentData = await repos.shiftAssignmentRepo.findById(input.requesterAssignmentId)
    const approverAssignmentData = await repos.shiftAssignmentRepo.findById(input.approverAssignmentId)

    if (!requesterAssignmentData || !approverAssignmentData) {
        logger.error('Shift assignment not found')
        throw throwCustomError(ErrorDescription.SHIFT_ASSIGNMENT_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา assignment วันที่มาก่อน
    const requesterDate = requesterAssignmentData.date
    const approverDate = approverAssignmentData.date

    const earliestAssignmentDate =
        requesterDate < approverDate
            ? requesterDate
            : approverDate

    const today = new Date()

    const diffDays = daysBetween(today, earliestAssignmentDate)
    console.log(diffDays)

    // ต้องขอแลกก่อนอย่างน้อย 3 วันก่อนจะถึงวันงาน
    if (diffDays < 3) {
        logger.error('Swap request must be created at least 3 days in advance')

        throw throwCustomError(
            ErrorDescription.SHIFT_SWAP_TOO_LATE,
            StatusCode.BAD_REQUEST_400
        )
    }

    let requesterTemplateData = null
    let approverTemplateData = null

    // หา template ของ re
    if (requesterAssignmentData.shiftTemplateId && approverAssignmentData.shiftTemplateId) {
        requesterTemplateData = await repos.shiftTemplateRepo.findById(requesterAssignmentData.shiftTemplateId)
        approverTemplateData = await repos.shiftTemplateRepo.findById(approverAssignmentData.shiftTemplateId)

        if (!requesterTemplateData || !approverTemplateData) {
            logger.error('Shift template not found')
            throw throwCustomError(ErrorDescription.SHIFT_TEMPLATE_NOT_FOUND, StatusCode.NOT_FOUND_404)
        }
    }

    const requesterDateFormat = formatDate(
        requesterAssignmentData.date,
        'dd-MM-yyyy'
    )

    const approverDateFormat = formatDate(
        approverAssignmentData.date,
        'dd-MM-yyyy'
    )

    // create shift swap request
    const newShiftSwapRequest = new ShiftSwapRequest({
        requesterUserId: currentUser.userId,
        approverUserId: approverUser.userId,
        requesterAssignmentId: requesterAssignmentData.shiftAssignmentId,
        approverAssignmentId: approverAssignmentData.shiftAssignmentId,
        status: ShiftSwapRequestStatus.PENDING,
        note: input.note,
        respondedAt: null,
    })

    const result = await repos.shiftSwapRequestRepo.create(newShiftSwapRequest);

    if (approverUser.lineUserId) {
        await services.lineService.sendMessage(
            approverUser.lineUserId,
            `🔔 *มีคำขอแลกเวรใหม่*\n\n` +
            `👤 ผู้ขอ: ${currentUser.firstName} ${currentUser.lastName}\n\n` +
            `🔄 เวรที่ต้องการแลก\n` +
            `📆 ${requesterDateFormat} (${requesterTemplateData?.type})\n\n` +
            `🧑‍⚕️ เวรของคุณ\n` +
            `📆 ${approverDateFormat} (${approverTemplateData?.type})\n\n` +
            `👉 กรุณาเข้าแอปเพื่ออนุมัติหรือปฏิเสธคำขอ`
        )
    }

    return result
}