import {v4 as uuidv4} from 'uuid';
import { WardMemberRole } from '@service/enums/wardMemberRole';

export class WardMember {
    public readonly wardMemberId: string;
    public readonly userId: string; //FK
    public readonly wardId: string; // FK
    public readonly role: WardMemberRole;
    public readonly createdAt: Date;

    constructor(params: {
        wardMemberId?: string
        userId: string
        wardId: string
        role: WardMemberRole
        createdAt?: Date
    }) {
        this.wardMemberId = params.wardMemberId ?? uuidv4();
        this.userId = params.userId;
        this.wardId = params.wardId;
        this.role = params.role;
        this.createdAt = params.createdAt ?? new Date();
    }
}