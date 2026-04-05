const tags = ['Line'];

export const lineConnectSchema = {
    description: 'Update user token for connect line OA',
    tags,
    response: {
        200: {
            addLineUrl: { type: 'string' },
            token: { type: 'string' },
        },
    },
};