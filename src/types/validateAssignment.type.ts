import { ShiftTemplateType } from '@service/enums/shiftTemplateType'
import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'

export type VirtualMonthAssignment = {
    userId: string
    wardId: string
    date: Date
    assignmentType: ShiftAssignmentType
    shiftTemplateId: string | null
}

export type VirtualShiftTemplate = {
    shiftTemplateId: string
    wardId: string
    type: string
    startTime: string
    endTime: string
    requiredPeople: number
    durationHours: number
}

export type WorkingSlot = {
    date: Date
    start: Date
    end: Date
    durationHours: number
    type: ShiftTemplateType
}

export type ExceedWorkHourInfo = {
    userId: string
    dates: Date[]
}