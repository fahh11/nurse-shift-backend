import { WardMemberRole } from '@service/enums/wardMemberRole';

const tags = ['WardMember'];

export const createWardMemberSchema = {
    description: 'Create a new ward member record',
    tags,
    params: {
        type: 'object',
        required: ['wardId'],
        properties: {
            wardId: { type: 'string' },
        },
    },
    body: {
        type: 'object',
        properties: {
            joinCode: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                wardMemberId: { type: 'string' },
                userId: { type: 'string' },
                wardId: { type: 'string' },
                role: { type: 'string', enum: Object.values(WardMemberRole) },
                createdAt: { type: 'string', format: 'date-time' },
            },
        },
    },
};

export const getAllWardMemberInWardSchema = {
    description: 'Get all ward member in ward',
    tags,
    params: {
        type: 'object',
        required: ['wardId'],
        properties: {
            wardId: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                },
            },
        },
    },
};