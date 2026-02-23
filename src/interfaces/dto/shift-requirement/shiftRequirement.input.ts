export interface CreateShiftRequirementInputDto {
    shiftTemplateId: string
    requiredPeople: number
    effectiveFrom: Date
    effectiveTo: Date
}