import { ShiftTemplateType } from "@service/enums/shiftTemplateType";

const tags = ['ShiftTemplate'];

export const createShiftTemplateSchema = {
    description: 'Create a new shift template record',
    tags,
    body: {
        type: 'array',
        items: {
            type: 'object',
            required: ['wardId', 'type', 'startTime', 'endTime', 'requiredPeople'],
            properties: {
                wardId: { type: 'string' },
                type: { type: 'string', enum: Object.values(ShiftTemplateType) },
                startTime: { 
                    type: 'string',
                    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
                },
                endTime: { 
                    type: 'string',
                    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
                },
                requiredPeople: { type: 'integer' },
            },
        },
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    shiftTemplate: {
                        type: 'object',
                        properties: {
                            shiftTemplateId: { type: 'string' },
                            wardId: { type: 'string' },
                            type: { type: 'string', enum: Object.values(ShiftTemplateType) },
                            startTime: { 
                                type: 'string',
                                pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
                            },
                            endTime: { 
                                type: 'string',
                                pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
                            },
                            requiredPeople: { type: 'integer' },
                        },
                    },
                    shiftRequirement: {
                        type: 'object',
                        properties: {
                            shiftRequirementId: { type: 'string' },
                            shiftTemplateId: { type: 'string' },
                            requiredPeople: { type: 'integer' },
                            effectiveFrom: { type: 'string', format: 'date' },
                            effectiveTo: {
                                type: ['string', 'null'],
                                format: 'date',
                                nullable: true,
                            },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                        },
                    },
                },
            },
        },
    },
};

export const updateShiftTemplateSchema = {
    description: 'Update shift template record',
    tags,
    params: {
        type: 'object',
        required: ['shiftTemplateId'],
        properties: {
            shiftTemplateId: { type: 'string' },
        },
    },

    body: {
        type: 'object',
        properties: {
            startTime: {
                type: 'string',
                pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
            },
            endTime: {
                type: 'string',
                pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
            },
        },
        additionalProperties: false,
    },
    
    response: {
        200: {
            type: 'object',
            properties: {
                shiftTemplateId: { type: 'string' },
                wardId: { type: 'string' },
                type: { type: 'string', enum: Object.values(ShiftTemplateType) },
                startTime: { 
                    type: 'string',
                    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
                },
                endTime: { 
                    type: 'string',
                    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    },
};

export const getAllShiftTemplateInWardSchema = {
    description: 'Get all shift template record in ward',
    tags,
    params: {
        type: 'object',
        required: ['wardId'],
        properties: {
            wardId: { type: 'string' },
        },
    },

    querystring: {
        type: 'object',
        required: ['year', 'month'],
        properties: {
            year: { type: 'integer' },
            month: {
                type: 'integer',
                minimum: 1,
                maximum: 12,
            },
        },
        additionalProperties: false,
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    shiftTemplateId: { type: 'string' },
                    wardId: { type: 'string' },
                    type: { type: 'string', enum: Object.values(ShiftTemplateType) },
                    startTime: { 
                        type: 'string',
                        pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
                    },
                    endTime: { 
                        type: 'string',
                        pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
                    },
                    requiredPeople: { type: 'integer' },
                },
            },
        },
    },
};