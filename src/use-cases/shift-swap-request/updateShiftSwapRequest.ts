import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftSwapRequest } from '@service/domain/entities/shiftSwapRequest'
import { UpdateShiftSwapRequestOutputDto } from '@service/interfaces/dto/shift-swap-request/shiftSwapRequest.output'
import { ShiftSwapRequestRepository } from '@service/domain/repositories/shiftSwapRequest.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { daysBetween } from '@service/helpers/timeHelper'
import { formatDate } from 'date-fns'
import { ShiftSwapRequestStatus } from '@service/enums/shiftSwapRequestStatus'

export const updateShiftSwapRequest = async(
    shiftSwapRequestId: string,
    userId: string,
    status: ShiftSwapRequestStatus,
    note: string | undefined,
    logger: FastifyInstance['log'],
    repos: {
        shiftSwapRequestRepo: ShiftSwapRequestRepository
        userRepo: UserRepository
        shiftAssignmentRepo: ShiftAssignmentRepository
    },

    services: {
        lineService: {
            sendMessage: (id: string, msg: string) => Promise<void>
        }
    }
): Promise<UpdateShiftSwapRequestOutputDto> => {
    // หา user ปัจจุบัน จาก id
    const currentUser = await repos.userRepo.findById(userId)

    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา shift swap request
    const existingShiftSwapRequest = await repos.shiftSwapRequestRepo.findById(shiftSwapRequestId)

    if (!existingShiftSwapRequest) {
        logger.error('Shift swap request not found')
        throw throwCustomError(ErrorDescription.SHIFT_SWAP_REQUEST_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หาผู้ขอ
    const requester = await repos.userRepo.findById(existingShiftSwapRequest.requesterUserId)

    if (!requester) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา shift assignment ที่ต้องการ approve, reject
    const requesterAssignmentData = await repos.shiftAssignmentRepo.findById(existingShiftSwapRequest.requesterAssignmentId)
    const approverAssignmentData = await repos.shiftAssignmentRepo.findById(existingShiftSwapRequest.approverAssignmentId)

    if (!requesterAssignmentData || !approverAssignmentData) {
        logger.error('Shift assignment not found')
        throw throwCustomError(ErrorDescription.SHIFT_ASSIGNMENT_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา shift swap ทุกอันที่เกี่ยวกับ assignment นี้
    const allRelateAssignments = await repos.shiftSwapRequestRepo.findByShiftAssignmentId(approverAssignmentData.shiftAssignmentId)

    // หา assignment วันที่มาก่อน
    const requesterDate = requesterAssignmentData.date
    const approverDate = approverAssignmentData.date

    const approverDateFormat = formatDate(
        approverDate,
        'dd-MM-yyyy'
    )

    const earliestAssignmentDate =
        requesterDate < approverDate
            ? requesterDate
            : approverDate

    const today = new Date()

    const diffDays = daysBetween(today, earliestAssignmentDate)
    console.log(diffDays)

    // ต้องขอแลกก่อนอย่างน้อย 1 วันก่อนจะถึงวันงาน
    if (diffDays < 1) {
        logger.error('Swap request must be created at least  days in advance')

        throw throwCustomError(
            ErrorDescription.SHIFT_SWAP_TOO_LATE,
            StatusCode.BAD_REQUEST_400
        )
    }

    // หากเป็นการ approve shift swap ที่เกี่ยวข้องจะถูก reject
    if (status === ShiftSwapRequestStatus.APPROVED) {
        // สลับเวร
        approverAssignmentData.update({
            userId: requester.userId
        })
        await repos.shiftAssignmentRepo.update(approverAssignmentData)


        requesterAssignmentData.update({
            userId: currentUser.userId
        })
        await repos.shiftAssignmentRepo.update(requesterAssignmentData)

        // ส่ง message แจ้งการ approve
        if (requester.lineUserId) {
            await services.lineService.sendMessage(
                requester.lineUserId,
                `คำขอแลกเวรของคุณและ ${currentUser.firstName} ${currentUser.lastName} ในวันที่ ${approverDateFormat}\n` + 
                `ถูกอนุมัติแล้ว ✅`
            )
        }

        // reject request ที่เกี่ยวข้อง
        for (const req of allRelateAssignments) {
            // ไม่ใช่ request ที่เพิ่ง approve และยังอยู่ในสถานะ pending
            if (req.shiftSwapRequestId !== shiftSwapRequestId && req.status === ShiftSwapRequestStatus.PENDING) {
                // หาผู้ขอ
                const rejectedUser = await repos.userRepo.findById(req.requesterUserId)

                if (!rejectedUser) {
                    logger.error('User not found')
                    throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
                }

                // อัปเดต status เป็น rejected
                req.update({ status: ShiftSwapRequestStatus.REJECTED })
                await repos.shiftSwapRequestRepo.update(req)

                // ส่ง message แจ้งการ reject
                if (rejectedUser.lineUserId) {
                    await services.lineService.sendMessage(
                        rejectedUser.lineUserId,
                        `คำขอแลกเวรของคุณและ ${currentUser.firstName} ${currentUser.lastName} ในวันที่ ${approverDateFormat}\n` + 
                        `ถูกปฏิเสธอัตโนมัต เนื่องจากเวรถูกอนุมัติไปแล้ว ❌`
                    )
                }
            }
        }
    }

    // update shift swap request
    existingShiftSwapRequest.update({
        status: status,
        note: note,
    })

    const result = await repos.shiftSwapRequestRepo.update(existingShiftSwapRequest)

    return result
}