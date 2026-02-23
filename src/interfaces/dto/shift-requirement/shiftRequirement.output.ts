export interface CreateShiftRequirementOutputDto {
    shiftRequirementId: string
    shiftTemplateId: string
    requiredPeople: number
    effectiveFrom: Date
    effectiveTo: Date | null
    createdAt: Date
    updatedAt: Date
}