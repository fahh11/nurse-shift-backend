import {v4 as uuidv4} from 'uuid';

export class Hospital {
    public readonly hospitalId: string;
    public name: string;
    public address: string;
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(params: {
        hospitalId?: string
        name: string
        address: string
        createdAt?: Date
        updatedAt?: Date
    }) {
        this.hospitalId = params.hospitalId ?? uuidv4();
        this.name = params.name.trim();
        this.address = params.address.trim();
        this.createdAt = params.createdAt ?? new Date();
        this.updatedAt = params.updatedAt ?? new Date();

        this.validateName(this.name);
        this.validateAddress(this.address);
    }

    private validateName(name: string) {
        if (!name) {
        throw new Error('Hospital name must not be empty')
        }
    }

    private validateAddress(address: string) {
        if (!address) {
            throw new Error('Hospital address must not be empty')
        }
    }

    update(data: {name?: string; address?: string }) {
        if (data.name !== undefined) {
            const trimmedName = data.name.trim();
            this.validateName(trimmedName);
            this.name = trimmedName;
        }

        if (data.address !== undefined) {
            const trimmedAddress = data.address.trim();
            this.validateAddress(trimmedAddress);
            this.address = trimmedAddress;
        }

        this.updatedAt = new Date();
    }
}