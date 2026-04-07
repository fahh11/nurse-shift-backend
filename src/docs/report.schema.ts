const tags = ['Report'];

export const exportReportSchema = {
    description: 'Export report',
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
        200: {}
    }
};