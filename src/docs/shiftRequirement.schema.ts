const tags = ['ShiftRequirement'];

export const createShiftRequirementSchema = {
    description: 'Create a new shift requirement record',
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
        required: ['requiredPeople'],
        properties: {
            requiredPeople: { type: 'integer' },
        },
    },
    response: {
        200: {
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
};

export const getAllShiftRequirementInShiftTemplateSchema = {
    description: 'Get all shift requirement record in shift template',
    tags,
    params: {
        type: 'object',
        required: ['shiftTemplateId'],
        properties: {
            shiftTemplateId: { type: 'string' },
        },
    },

    response: {
        200: {
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
};

