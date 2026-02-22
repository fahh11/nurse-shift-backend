const tags = ['Auth'];

export const googleCreateUserSchema = {
    description: 'Create a new user record from google',
    tags,
    querystring: {
        type: 'object',
        required: ['code'],
        properties: {
            code: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                accessToken: { type: 'string' },
                userId: { type: 'string' },
                personalEmail: { type: 'string' },
                profileCompleted: { type: 'boolean'  , default: false },
            },
        },
    },
};

export const getMeSchema = {
    description: 'Get user login record',
    tags,
    response: {
        200: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                personalEmail: { type: 'string' },
                lineUserId: { type: ['string', 'null'], nullable: true },
                hospitalId: { type: 'string' },
                profileCompleted: { type: 'boolean', default: false },
            },
        },
    },
};