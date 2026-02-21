const tags = ['Auth'];

export const googleCreateUserSchema = {
    description: 'Create a new user record from google',
    tags,
    body: {
        type: 'object',
        required: ['tokenId'],
        properties: {
            tokenId: { type: 'string' },
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