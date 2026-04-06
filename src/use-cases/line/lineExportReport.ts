
import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import crypto from 'crypto'
import * as line from '@line/bot-sdk'
import { env } from '@service/config/env'
import { UserRepository } from '@service/domain/repositories/user.repository'

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: env.line.channelAccessToken
})

export const lineWebhook = async(
    input: any,
    logger: FastifyInstance['log'],
    repos: {
        userRepo: UserRepository

    }
) => {
    const events = input.events
    console.log("=========")
    console.log(events)
    console.log("=========")

    if (!events?.length) return

    for (const event of events) {

        // รับเฉพาะ message event
        if (event.type !== 'message') continue
        if (event.message.type !== 'text') continue

        const text: string = event.message.text
        const lineUserId: string = event.source.userId

        // ต้องพิมพ์: register <token>
        if (!text.startsWith('report')) continue

        const token = text.split(' ')[1]

        if (!token) {
            logger.error('Token missing')
            return
        }

        // ✅ เช็คว่าเคย register แล้วไหม
        const existingUser = await repos.userRepo.findByLineUserId(lineUserId)

        if (existingUser) {
            await client.replyMessage({
                replyToken: event.replyToken,
                messages: [
                    {
                        type: 'text',
                        text:
                            'บัญชี LINE นี้ได้ยืนยันตัวตนแล้ว\n\n' +
                            'คุณสามารถใช้งานระบบได้ทันที 🎉'
                    }
                ]
            })

            logger.info(`LINE already linked: ${lineUserId}`)
            continue
        } else {
            await client.replyMessage({
                replyToken: event.replyToken,
                messages: [
                    {
                        type: 'text',
                        text:
                            'บัญชี LINE นี้ยังไม่ได้รับการยืนยันตัวตน\n\n' +
                            'กรุณากดขอรหัสผ่านใหม่จากระบบ แล้วพิมพ์: \n' +
                            'register <รหัสผ่านใหม่>\n' +
                            'เพื่อยืนยันตัวตนอีกครั้ง 🙏'
                    }
                ]
            })

            logger.info(`LINE already linked: ${lineUserId}`)
        }

        
    }
}