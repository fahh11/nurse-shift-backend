import {v4 as uuidv4} from 'uuid';
import { ShiftTemplateType } from '@service/enums/shiftTemplateType';
import { toMinutes } from '@service/helpers/timeHelper';

export class ShiftTemplate {
    public readonly shiftTemplateId: string;
    public readonly wardId: string; //FK
    public readonly type: ShiftTemplateType;
    public startTime: string;
    public endTime: string;
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(params: {
        shiftTemplateId?: string
        wardId: string
        type: ShiftTemplateType
        startTime: string
        endTime: string
        createdAt?: Date
        updatedAt?: Date
    }) {
        this.shiftTemplateId = params.shiftTemplateId ?? uuidv4();
        this.wardId = params.wardId;
        this.type = params.type;
        this.startTime = params.startTime;
        this.endTime = params.endTime;
        this.createdAt = params.createdAt ?? new Date();
        this.updatedAt = params.updatedAt ?? new Date();

        this.validateTime(this.startTime, this.endTime);
    }

    private validateTime(startTime: string, endTime: string) {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!timeRegex.test(startTime)) {
            throw new Error('Invalid startTime format. Expected HH:mm');
        }

        if (!timeRegex.test(endTime)) {
            throw new Error('Invalid endTime format. Expected HH:mm');
        }
    }

    update(data: {
        startTime?: string;
        endTime?: string;
    }) {
        const newStartTime = data.startTime ?? this.startTime;
        const newEndTime = data.endTime ?? this.endTime;

        this.validateTime(newStartTime, newEndTime);

        this.startTime = newStartTime;
        this.endTime = newEndTime;

        this.updatedAt = new Date();
    }
}