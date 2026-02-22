const tags = ['User'];

export const updateUserForCompleteProfileSchema = {
    description: 'Update user profile information to complete the profile',
    tags,
    body: {
        type: 'object',
        required: ['userId', 'firstName', 'lastName', 'lineUserId', 'mobilePhone', 'hospitalId'],
        properties: {
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            hospitalId: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                personalEmail: { type: 'string' },
                googleEmailId: { type: 'string' },
                lineUserId: { type: ['string', 'null'], nullable: true },
                hospitalId: { type: 'string' },
                profileCompleted: { type: 'boolean', default: false },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    },
};

export const updateUserSchema = {
    description: 'Update user profile information',
    tags,
    body: {
        type: 'object',
        required: ['userId'],
        properties: {
            userId: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            lineUserId: { type: 'string' },
            hospitalId: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                personalEmail: { type: 'string' },
                googleEmailId: { type: 'string' },
                lineUserId: { type: ['string', 'null'], nullable: true },
                hospitalId: { type: 'string' },
                profileCompleted: { type: 'boolean', default: false },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    },
};
