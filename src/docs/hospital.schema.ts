const tags = ['Hospital'];

export const createHospitalSchema = {
    description: 'Create a new hospital record',
    tags,
    body: {
        type: 'object',
        required: ['name', 'address'],
        properties: {
            name: { type: 'string' },
            address: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                hospitalId: { type: 'string' },
                name: { type: 'string' },
                address: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    },
};

export const updateHospitalSchema = {
    description: 'Update hospital record',
    tags,
    body: {
        type: 'object',
        required: ['hospitalId'],
        properties: {
            hospitalId: { type: 'string' },
            name: { type: 'string' },
            address: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                hospitalId: { type: 'string' },
                name: { type: 'string' },
                address: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    },
};

export const getAllHospitalSchema = {
    description: 'Get all hospital record',
    tags,
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    hospitalId: { type: 'string' },
                    name: { type: 'string' },
                },
            },
        },
    },
};
