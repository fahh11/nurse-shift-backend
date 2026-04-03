import { ShiftAssignmentType } from "@service/enums/shiftAssignmentType";

const tags = ['ShiftAssignment'];

export const createShiftAssignmentSchema = {
    description: 'Create a new shift assignment record',
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

    body: {
        type: 'array',
        items: {
            type: 'object',
            required: ['userId', 'date', 'assignmentType'],
            properties: {
                userId: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
                assignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
                shiftTemplateId: { type: 'string' },

            },
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                results: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            shiftAssignmentId: { type: 'string' },
                            shiftTemplateId:  { type: ['string', 'null'], nullable: true },
                            wardId: { type: 'string' },
                            userId: { type: 'string' },
                            date: { type: 'string', format: 'date-time' },
                            assignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
                            createdBy: { type: 'string' },
                            updatedBy: { type: 'string' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                        }
                    }
                },
                warning: { 
                    type: 'array',
                    items: { type: 'string' },
                    nullable: true
                }
            }
        }
    }
};

export const updateShiftAssignmentSchema = {
    description: 'Upadte shift assignment record',
    tags,
    params: {
        type: 'object',
        required: ['shiftAssignmentId'],
        properties: {
            shiftAssignmentId: { type: 'string' },
        },
    },
    body: {
        type: 'object',
        properties: {
            shiftTemplateId:  { type: 'string' },
            assignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                shiftAssignmentId: { type: 'string' },
                shiftTemplateId:  { type: ['string', 'null'], nullable: true },
                wardId: { type: 'string' },
                userId: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
                assignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
                createdBy: { type: 'string' },
                updatedBy: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    },
};

export const summaryMonthShiftAssignmentSchema = {
    description: 'Get shift assignments summary by month',
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
                    userId: { type: 'string' },
                    name: { type: 'string' },
                    assignments: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                shiftAssignmentId: { type: 'string' },
                                shiftTemplateType: { type: ['string', 'null'], nullable: true }, 
                                date: { type: 'string', format: 'date' },
                                assignmentType: {
                                    type: 'string',
                                    enum: Object.values(ShiftAssignmentType),
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const deleteShiftAssignmentSchema = {
    description: 'delete shift assignment record',
    tags,
    params: {
        type: 'object',
        required: ['shiftAssignmentId'],
        properties: {
            shiftAssignmentId: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                shiftAssignmentId: { type: 'string' },
                shiftTemplateId:  { type: ['string', 'null'], nullable: true },
                wardId: { type: 'string' },
                userId: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
                assignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
                createdBy: { type: 'string' },
                updatedBy: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    },
};