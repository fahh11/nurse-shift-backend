import { WardStatus } from '@service/enums/wardStatus';

const tags = ['Ward'];

export const createWardSchema = {
    description: 'Create a new ward record',
    tags,
    body: {
        type: 'object',
        required: ['wardName'],
        properties: {
            wardName: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                wardId: { type: 'string' },
                wardName: { type: 'string' },
                hospitalId: { type: 'string' },
                joinCode: { type: 'string' },
                joinCodeStatus: { type: 'boolean' },
                status: { type: 'string', enum: Object.values(WardStatus) },
                createdBy: { type: 'string' },
                updatedBy: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    },
};

export const updateWardSchema = {
    description: 'Update ward record',
    tags,
    body: {
        type: 'object',
        required: [],
        properties: {
            wardId: { type: 'string' },
            wardName: { type: 'string' },
            hospitalId: { type: 'string' },
            joinCodeStatus: { type: 'boolean' },
            status: { type: 'string', enum: Object.values(WardStatus) }
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                wardId: { type: 'string' },
                wardName: { type: 'string' },
                hospitalId: { type: 'string' },
                joinCode: { type: 'string' },
                joinCodeStatus: { type: 'boolean' },
                status: { type: 'string', enum: Object.values(WardStatus) },
                createdBy: { type: 'string' },
                updatedBy: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    },
};

export const getAllWardInHospitalSchema = {
    description: 'Get all ward in hospital',
    tags,
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    wardId: { type: 'string' },
                    wardName: { type: 'string' },
                    member: { type: 'integer' },
                    createdBy: { type: 'string' },
                },
            },
        },
    },
};

export const getWardByIdSchema = {
    description: 'Get ward by ward id',
    tags,
    params: {
        type: 'object',
        required: ['wardId'],
        properties: {
            wardId: { type: 'string' }
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                wardId: { type: 'string' },
                wardName: { type: 'string' },
                hospitalName: { type: 'string' },
                joinCode: { type: 'string' },
                createdBy: { type: 'string' },
            },
        },
    },
};