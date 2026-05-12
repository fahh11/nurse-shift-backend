import {v4 as uuidv4} from 'uuid';

export class User {
    public readonly userId: string;
    public firstName: string | null;
    public lastName: string | null;
    public personalEmail: string;
    public googleEmailId: string;
    public lineUserId: string | null;
    public lineLinkToken: string | null;
    public lineLinkTokenExpire: Date | null;
    public hospitalId: string | null;
    public profileCompleted: boolean;
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(params: {
        userId?: string
        firstName?: string | null
        lastName?: string | null
        personalEmail: string
        googleEmailId: string
        lineUserId?: string | null
        lineLinkToken?: string | null
        lineLinkTokenExpire?: Date | null
        hospitalId?: string | null
        profileCompleted: boolean
        createdAt?: Date
        updatedAt?: Date
    }) {
        this.userId = params.userId ?? uuidv4();
        this.firstName = params.firstName ?? null;
        this.lastName = params.lastName ?? null;
        this.personalEmail = params.personalEmail.trim();
        this.googleEmailId = params.googleEmailId.trim();
        this.lineUserId = params.lineUserId ?? null;
        this.lineLinkToken = params.lineLinkToken ?? null;
        this.lineLinkTokenExpire = params.lineLinkTokenExpire ?? null;
        this.hospitalId = params.hospitalId ?? null;
        this.profileCompleted = params.profileCompleted ?? false;
        this.createdAt = params.createdAt ?? new Date();
        this.updatedAt = params.updatedAt ?? new Date();

        this.validatePersonalEmail(this.personalEmail);
        this.validateGoogleEmailId(this.googleEmailId);
    }

    private validatePersonalEmail(email: string) {
        if (!email) {
        throw new Error('Personal email must not be empty')
        }
    }

    private validateGoogleEmailId(googleEmailId: string) {
        if (!googleEmailId) {
        throw new Error('Google email ID must not be empty')
        }
    }

    update(data: {
        firstName?: string
        lastName?: string
        nickname?: string | null
        birthDate?: Date | null
        lineUserId?: string
        lineLinkToken?: string | null
        lineLinkTokenExpire?: Date | null
        mobilePhone?: string
        hospitalId?: string
        profileCompleted?: boolean
    }) {
        if (data.firstName !== undefined) {
            const trimmedFirstName = data.firstName?.trim() ?? null;
            this.firstName = trimmedFirstName;
        }

        if (data.lastName !== undefined) {
            const trimmedLastName = data.lastName?.trim() ?? null;
            this.lastName = trimmedLastName;
        }

        if (data.lineUserId !== undefined) {
            this.lineUserId = data.lineUserId;
        }

        if (data.lineLinkToken !== undefined) {
            this.lineLinkToken = data.lineLinkToken;
        }

        if (data.lineLinkTokenExpire !== undefined) {
            this.lineLinkTokenExpire = data.lineLinkTokenExpire;
        }

        if (data.hospitalId !== undefined) {
            this.hospitalId = data.hospitalId;
        }

        if (data.profileCompleted !== undefined) {
            this.profileCompleted = data.profileCompleted;
        }
        
        this.updatedAt = new Date();
    }
}
