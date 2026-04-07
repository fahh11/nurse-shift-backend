import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import ExcelJS from 'exceljs'
import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { ShiftRequirementRepository } from '@service/domain/repositories/shiftRequirement.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardRepository } from '@service/domain/repositories/ward.repository'
import { styleCell } from '@service/helpers/excelHelpers'
import { calculateDurationHours } from '@service/helpers/calculateDurationHours'

// sanitize ชื่อ sheet
const sanitizeSheetName = (name: string) => {
  return name.replace(/[*?:\\/\[\]]/g, '').substring(0, 31)
}

type VirtualShiftTemplate = {
    shiftTemplateId: string
    wardId: string
    type: string
    startTime: string
    endTime: string
    requiredPeople: number
    durationHours: number
}

export const exportReport = async(
    reply: any,
    userId: string,
    wardId: string,
    month: number,
    year: number,
    logger: FastifyInstance['log'],
    repos: {
        shiftAssignmentRepo: ShiftAssignmentRepository
        shiftTemplateRepo: ShiftTemplateRepository
        shiftRequirementRepo: ShiftRequirementRepository
        userRepo: UserRepository
        wardRepo: WardRepository
    }
) => {
    // -------------------- validate --------------------
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    const wardData = await repos.wardRepo.findById(wardId)
    if (!wardData) {
        throw throwCustomError(ErrorDescription.WARD_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    const assignments = await repos.shiftAssignmentRepo.findActiveAssignmentByWardIdAndMonth(wardId, month, year)

    // ดึง month assignment ของเดือนนี้
    const allMonthAssignments = await repos.shiftAssignmentRepo.findActiveAssignmentByWardIdAndMonth(wardData.wardId, month, year)

    const virtualMonthAssignments = [
        ...allMonthAssignments.map(a => ({
            userId: a.userId,
            wardId: a.wardId,
            date: a.date,
            assignmentType: a.assignmentType,
            shiftTemplateId: a.shiftTemplateId
        })),
    ].sort((a, b) => a.date.getTime() - b.date.getTime())

    // ดึง shift template shift requirement ที่ active ทั้งหมดใน ward นี้
    const allShiftTemplateInWard = await repos.shiftTemplateRepo.findByWardId(wardData.wardId)

    const virtualAllShiftTemplate: VirtualShiftTemplate[] = []

    for (const template of allShiftTemplateInWard) {
        const activeShiftRequirement = await repos.shiftRequirementRepo.findActiveByShiftTemplateId(template.shiftTemplateId)

        if (!activeShiftRequirement) {
            logger.error('Active shift requirement not found for shift template id: ' + template.shiftTemplateId)
            throw throwCustomError(
                ErrorDescription.SHIFT_REQUIREMENT_NOT_FOUND,
                StatusCode.NOT_FOUND_404
            )
        }

        virtualAllShiftTemplate.push({
            shiftTemplateId: template.shiftTemplateId,
            wardId: template.wardId,
            type: template.type,
            startTime: template.startTime,
            endTime: template.endTime,
            requiredPeople: activeShiftRequirement.requiredPeople,
            durationHours: calculateDurationHours(template.startTime, template.endTime)
        })
    }

    // -------------------- create workbook --------------------
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(
        sanitizeSheetName(`Ward ${wardData.wardName}`)
    )

    // -------------------- header --------------------
    const daysInMonth = new Date(year, month, 0).getDate()

    const header = ['User']
    for (let d = 1; d <= daysInMonth; d++) {
        header.push(d.toString())
    }

    const headerRow = worksheet.addRow(header)
    headerRow.font = { bold: true }

    // -------------------- group by user --------------------
    // Seleted Date range
    // worksheet.addRow(['Selected Range', `${month} - ${year}`])
    // worksheet.addRow([])

    const users = Array.from(new Set(virtualMonthAssignments.map((a) => a.userId)))

    // หา max shifts per day ของแต่ละ user (เพื่อกำหนดจำนวน row ต่อ user)
    const userMaxShifts = new Map<string, number>()
    for (const uId of users) {
        const userAssignments = virtualMonthAssignments.filter((a) => a.userId === uId)
        let max = 1
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month - 1, d)
            const count = userAssignments.filter(
                (a) => a.date.toDateString() === date.toDateString()
            ).length
            if (count > max) max = count
        }
        userMaxShifts.set(uId, max)
    }

    let currentRowIndex = worksheet.lastRow!.number + 1

    for (const uId of users) {
        const userAssignments = virtualMonthAssignments.filter((a) => a.userId === uId)
        const user = await repos.userRepo.findById(uId)
        const maxShifts = userMaxShifts.get(uId) ?? 1
        const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown'

        // สร้าง rows ตามจำนวน maxShifts
        const rowsData: any[][] = Array.from({ length: maxShifts }, () => 
            Array(daysInMonth + 1).fill('')
        )

        // ใส่ชื่อ user ที่ row แรก (จะ merge ทีหลัง)
        rowsData[0][0] = userName

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month - 1, d)
            const dayAssignments = userAssignments.filter(
                (a) => a.date.toDateString() === date.toDateString()
            )

            dayAssignments.forEach((assignment, idx) => {
                if (idx >= maxShifts) return
                const template = virtualAllShiftTemplate.find(
                    t => t.shiftTemplateId === assignment.shiftTemplateId
                )
                rowsData[idx][d] = assignment.shiftTemplateId ? template?.type : assignment.assignmentType
            })
        }

        // add rows
        for (const rowData of rowsData) {
            worksheet.addRow(rowData)
        }

        // merge ชื่อ user (column A) ถ้ามีหลาย row
        if (maxShifts > 1) {
            worksheet.mergeCells(currentRowIndex, 1, currentRowIndex + maxShifts - 1, 1)
            const mergedCell = worksheet.getCell(currentRowIndex, 1)
            mergedCell.alignment = { vertical: 'middle', horizontal: 'left' }
        }

        currentRowIndex += maxShifts
    }

    // -------------------- style --------------------
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).eachCell((cell) => styleCell(cell, 'FFCCE5FF'))

    worksheet.columns.forEach((col) => {
        col.width = 15
    })

    // -------------------- generate buffer --------------------
    const arrayBuffer = await workbook.xlsx.writeBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // debug (optional)
    logger.info(`Excel size: ${buffer.length}`)

    // -------------------- SEND FILE (สำคัญสุด) --------------------
    // ✅ แบบใหม่ (ใช้ Fastify API ตรงๆ)

    const fileName = `report-${wardData.wardName}-${month}-${year}.xlsx`
    
    reply
        .header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .header('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,)
        .send(buffer)
}