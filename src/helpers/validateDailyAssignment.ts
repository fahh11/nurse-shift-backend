import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftAssignment } from '@service/domain/entities/shiftAssignment'
import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'

export const validateDailyAssignment = (
    wardId: string,
    existingAssignments: ShiftAssignment[],
    incomingAssignmentType: ShiftAssignmentType
): void => {
    // กรอง assignment type shift และอยู่ใน ward นี้
    const wardAssignments = existingAssignments.filter(
        a => a.wardId === wardId
    )

    const hasSpecialAssignment = wardAssignments.some(
        a => a.assignmentType !== ShiftAssignmentType.SHIFT
    )

    const hasAnyAssignment = wardAssignments.length > 0

    // ✅ กำลังเพิ่ม SHIFT
    if (incomingAssignmentType === ShiftAssignmentType.SHIFT) {
        // มี OFF / LEAVE / EMERGENCY อยู่แล้ว
        if (hasSpecialAssignment) {
            throw throwCustomError(
                ErrorDescription.CONFLICTING_ASSIGNMENT_EXISTS,
                StatusCode.BAD_REQUEST_400
            )
        }
    }

    // ✅ กำลังเพิ่ม OFF / LEAVE / EMERGENCY
    else {

        // วันนั้นต้องว่าง
        if (hasAnyAssignment) {
            throw throwCustomError(
                ErrorDescription.DAY_ALREADY_HAS_ASSIGNMENT,
                StatusCode.BAD_REQUEST_400
            )
        }
    }
}