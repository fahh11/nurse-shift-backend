import {v4 as uuidv4} from 'uuid';

export class ShiftRequirement {
    public readonly shiftRequirementId: string;
    public readonly shiftTemplateId: string; //FK
    public readonly requiredPeople: number;
    public readonly effectiveFrom: Date;
    public effectiveTo: Date | null;
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(params: {
        shiftRequirementId?: string
        shiftTemplateId: string
        requiredPeople: number
        effectiveFrom: Date
        effectiveTo: Date | null
        createdAt?: Date
        updatedAt?: Date
    }) {
        this.shiftRequirementId = params.shiftRequirementId ?? uuidv4();
        this.shiftTemplateId = params.shiftTemplateId;
        this.requiredPeople = params.requiredPeople;
        this.effectiveFrom = params.effectiveFrom;
        this.effectiveTo = params.effectiveTo ?? null;
        this.createdAt = params.createdAt ?? new Date();
        this.updatedAt = params.updatedAt ?? new Date();

        this.validateRequiredPeople(this.requiredPeople);
        this.validateEffectiveDates(this.effectiveFrom, this.effectiveTo);
    }

    private validateRequiredPeople(people: number) {
        if (!Number.isInteger(people) || people <= 0) {
            throw new Error('requiredPeople must be a positive integer');
        }
    }

    private validateEffectiveDates(from: Date, to: Date | null) {
        if (to && to < from) {
            throw new Error('effectiveTo must be after or equal to effectiveFrom');
        }
    }

    update(data: {
        effectiveTo?: Date | null;
    }) {
        if (data.effectiveTo !== undefined) {
        this.validateEffectiveDates(this.effectiveFrom, data.effectiveTo);
        this.effectiveTo = data.effectiveTo;
        }

        this.updatedAt = new Date();
    }
}