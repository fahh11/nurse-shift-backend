import {v4 as uuidv4} from 'uuid';
import { ShiftSwapRequestStatus } from '@service/enums/shiftSwapRequestStatus'; 

export class ShiftSwapRequest {
    public readonly shiftSwapRequestId: string;
    public requesterUserId: string; //FK
    public approverUserId: string; //FK
    public requesterAssignmentId: string; //FK
    public approverAssignmentId: string; //FK
    public status: ShiftSwapRequestStatus;
    public note: string | null;
    public readonly requestedAt: Date;
    public respondedAt: Date | null;

    constructor(params: {
        shiftSwapRequestId?: string
        requesterUserId: string
        approverUserId: string
        requesterAssignmentId: string
        approverAssignmentId: string
        status: ShiftSwapRequestStatus
        note?: string | null
        requestedAt?: Date
        respondedAt?: Date | null
    }) {
        this.shiftSwapRequestId = params.shiftSwapRequestId ?? uuidv4();
        this.requesterUserId = params.requesterUserId;
        this.approverUserId = params.approverUserId;
        this.requesterAssignmentId = params.requesterAssignmentId;
        this.approverAssignmentId = params.approverAssignmentId;
        this.status = params.status;
        this.note = params.note ?? null;
        this.requestedAt = params.requestedAt ?? new Date();
        this.respondedAt = params.respondedAt ?? null;
    }

    update(data: {
        status?: ShiftSwapRequestStatus;
        note?: string;
    }) {
        if (data.status !== undefined) {
            this.status = data.status;
        }

        if (data.note !== undefined) {
            this.note = data.note;
        }

        this.respondedAt = new Date();
    }
}