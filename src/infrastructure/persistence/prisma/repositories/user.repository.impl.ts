import { prisma } from '@service/lib/prisma';
import { User } from '@service/domain/entities/user'
import { UserRepository } from '@service/domain/repositories/user.repository'

export class PrismaUserRepository implements UserRepository {
    async create(user: User): Promise<User> {
        const created = await prisma.user.create({
            data: {
                personal_email: user.personalEmail,
                google_email_id: user.googleEmailId,
            },
        })

        return new User({
            userId: created.user_id,
            firstName: created.first_name,
            lastName: created.last_name,
            personalEmail: created.personal_email,
            googleEmailId: created.google_email_id,
            lineUserId: created.line_user_id,
            lineLinkToken: created.line_link_token,
            lineLinkTokenExpire: created.line_link_token_expire,
            hospitalId: created.hospital_id,
            profileCompleted: created.profile_completed,
            createdAt: created.created_at,
            updatedAt: created.updated_at,
        })
    }

    async findById(userId: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { user_id: userId } })
        return user
        ? new User({
            userId: user.user_id,
            firstName: user.first_name,
            lastName: user.last_name,
            personalEmail: user.personal_email,
            googleEmailId: user.google_email_id,
            lineUserId: user.line_user_id,
            lineLinkToken: user.line_link_token,
            lineLinkTokenExpire: user.line_link_token_expire,
            hospitalId: user.hospital_id,
            profileCompleted: user.profile_completed,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        })
        : null
    }

    async findByPersonalEmail(personalEmail: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { personal_email: personalEmail } })
        return user
        ? new User({
            userId: user.user_id,
            firstName: user.first_name,
            lastName: user.last_name,
            personalEmail: user.personal_email,
            googleEmailId: user.google_email_id,
            lineUserId: user.line_user_id,
            lineLinkToken: user.line_link_token,
            lineLinkTokenExpire: user.line_link_token_expire,
            hospitalId: user.hospital_id,
            profileCompleted: user.profile_completed,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        })
        : null
    }

    async findByLineLinkToken(token: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { line_link_token: token } })
        return user
        ? new User({
            userId: user.user_id,
            firstName: user.first_name,
            lastName: user.last_name,
            personalEmail: user.personal_email,
            googleEmailId: user.google_email_id,
            lineUserId: user.line_user_id,
            lineLinkToken: user.line_link_token,
            lineLinkTokenExpire: user.line_link_token_expire,
            hospitalId: user.hospital_id,
            profileCompleted: user.profile_completed,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        })
        : null
    }

    async findByLineUserId(lineUserId: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { line_user_id: lineUserId } })
        return user
        ? new User({
            userId: user.user_id,
            firstName: user.first_name,
            lastName: user.last_name,
            personalEmail: user.personal_email,
            googleEmailId: user.google_email_id,
            lineUserId: user.line_user_id,
            lineLinkToken: user.line_link_token,
            lineLinkTokenExpire: user.line_link_token_expire,
            hospitalId: user.hospital_id,
            profileCompleted: user.profile_completed,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        })
        : null
    }

    async findAll(): Promise<User[]> {
        const users = await prisma.user.findMany()
        return users.map(
            (user) => 
                new User({
                    userId: user.user_id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    personalEmail: user.personal_email,
                    googleEmailId: user.google_email_id,
                    lineUserId: user.line_user_id,
                    lineLinkToken: user.line_link_token,
                    lineLinkTokenExpire: user.line_link_token_expire,
                    hospitalId: user.hospital_id,
                    profileCompleted: user.profile_completed,
                    createdAt: user.created_at,
                    updatedAt: user.updated_at,
                })
        )
    }

    async update(user: User): Promise<User> {
        const updated = await prisma.user.update({
            where: { user_id: user.userId },
            data: {
                first_name: user.firstName,
                last_name: user.lastName,
                personal_email: user.personalEmail,
                google_email_id: user.googleEmailId,
                line_user_id: user.lineUserId,
                line_link_token: user.lineLinkToken,
                line_link_token_expire: user.lineLinkTokenExpire,
                hospital_id: user.hospitalId,
                profile_completed: user.profileCompleted,
                updated_at: new Date(),
            },
        })

        return new User({
            userId: updated.user_id,
            firstName: updated.first_name,
            lastName: updated.last_name,
            personalEmail: updated.personal_email,
            googleEmailId: updated.google_email_id,
            lineUserId: updated.line_user_id,
            lineLinkToken: updated.line_link_token,
            lineLinkTokenExpire: updated.line_link_token_expire,
            hospitalId: updated.hospital_id,
            profileCompleted: updated.profile_completed,
            createdAt: updated.created_at,
            updatedAt: updated.updated_at,
        })
    }

    async delete(userId: string): Promise<void> {
        await prisma.user.delete({ where: { user_id: userId } })
    }
}