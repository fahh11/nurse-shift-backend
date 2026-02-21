import {v4 as uuidv4} from 'uuid';
import { WardStatus } from '@service/enums/wardStatus';

export class Ward {
    public readonly wardId: string;
    public wardName: string;
    public hospitalId: string; // FK
    public joinCode: string;
    public joinCodeStatus: boolean;
    public status: WardStatus;
    public createdBy: string; // FK
    public updatedBy: string; // FK
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(params: {
        wardId?: string
        wardName: string
        hospitalId: string
        joinCode: string
        joinCodeStatus: boolean
        status: WardStatus
        createdBy: string
        updatedBy: string
        createdAt?: Date
        updatedAt?: Date
    }) {
        this.wardId = params.wardId ?? uuidv4();
        this.wardName = params.wardName.trim();
        this.hospitalId = params.hospitalId;
        this.joinCode = params.joinCode;
        this.joinCodeStatus = params.joinCodeStatus;
        this.status = params.status;
        this.createdBy = params.createdBy;
        this.updatedBy = params.updatedBy;
        this.createdAt = params.createdAt ?? new Date();
        this.updatedAt = params.updatedAt ?? new Date();

        this.validateWardName(this.wardName);
    }

    private validateWardName(wardName: string) {
        if (!wardName) {
        throw new Error('Ward name must not be empty')
        }
    }

    update(data: {
        wardName?: string;
        hospitalId?: string;
        joinCodeStatus?: boolean;
        status?: WardStatus;
    }) {
        if (data.wardName !== undefined) {
            const trimmedWardName = data.wardName.trim();
            this.validateWardName(trimmedWardName);
            this.wardName = trimmedWardName;
        }

        if (data.hospitalId !== undefined) {
            this.hospitalId = data.hospitalId;
        }

        if (data.joinCodeStatus !== undefined) {
            this.joinCodeStatus = data.joinCodeStatus;
        }

        if (data.status !== undefined) {
            this.status = data.status;
        }

        this.updatedAt = new Date();
    }
}