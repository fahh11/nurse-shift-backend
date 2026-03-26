import {v4 as uuidv4} from 'uuid';
import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType';

export class ShiftAssignment {
    public readonly shiftAssignmentId: string;
    public  shiftTemplateId: string | null; //FK
    public readonly wardId: string; //FK
    public readonly userId: string; //FK
    public readonly date: Date;
    public assignmentType: ShiftAssignmentType;
    public createdBy: string; // FK
    public updatedBy: string; // FK
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(params: {
        shiftAssignmentId?: string
        shiftTemplateId: string | null
        wardId: string
        userId: string
        date: Date
        assignmentType: ShiftAssignmentType
        createdBy: string
        updatedBy: string
        createdAt?: Date
        updatedAt?: Date
    }) {
        this.shiftAssignmentId = params.shiftAssignmentId ?? uuidv4();
        this.shiftTemplateId = params.shiftTemplateId ?? null;
        this.wardId = params.wardId;
        this.userId = params.userId;
        this.date = params.date;
        this.assignmentType = params.assignmentType;
        this.createdBy = params.createdBy;
        this.updatedBy = params.updatedBy;
        this.createdAt = params.createdAt ?? new Date();
        this.updatedAt = params.updatedAt ?? new Date();
    }

    update(data: {
        shiftTemplateId?: string;
        assignmentType?: ShiftAssignmentType;
        updatedBy?: string;
    }) {
        if (data.shiftTemplateId !== undefined) {
            this.shiftTemplateId = data.shiftTemplateId;
        }

        if (data.assignmentType !== undefined) {
            this.assignmentType = data.assignmentType;
        }

        if (data.updatedBy !== undefined) {
            this.updatedBy = data.updatedBy;
        }

        this.updatedAt = new Date();
    }
}