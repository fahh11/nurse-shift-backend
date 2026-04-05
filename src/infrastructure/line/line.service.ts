import * as line from '@line/bot-sdk'

const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
})

export const lineService = {
    sendMessage: async (id: string, msg: string) => {
        await client.pushMessage({
            to: id,
            messages: [{ type: 'text', text: msg }]
        })
    }
}