import { prisma } from '@service/lib/prisma';
import { WardMember } from '@service/domain/entities/wardMember';
import { WardMemberRepository } from '@service/domain/repositories/wardMember.repository';
import { WardMemberRole } from '@service/enums/wardMemberRole';

export class PrismaWardMemberRepository implements WardMemberRepository {
    async create(wardMember: WardMember): Promise<WardMember> {
        const created = await prisma.ward_member.create({
            data: {
                user_id: wardMember.userId,
                ward_id: wardMember.wardId,
                role: wardMember.role,
            }
        })

        return new WardMember({
            wardMemberId: created.ward_member_id,
            userId: created.user_id,
            wardId: created.ward_id,
            role: created.role as WardMemberRole,
            createdAt: created.created_at
        })
    }

    async findById(wardMemberId: string): Promise<WardMember | null> {
        const wardMember = await prisma.ward_member.findUnique({ where: { ward_member_id: wardMemberId } })
        return wardMember
        ? new WardMember({
            wardMemberId: wardMember.ward_member_id,
            userId: wardMember.user_id,
            wardId: wardMember.ward_id,
            role: wardMember.role as WardMemberRole,
            createdAt: wardMember.created_at
        }) : null
    }

    async findByUserId(userId: string): Promise<WardMember[]> {
        const wardMembers = await prisma.ward_member.findMany({ where: { user_id: userId } })
        return wardMembers.map(
            (wardMember) =>
                new WardMember({
                    wardMemberId: wardMember.ward_member_id,
                    userId: wardMember.user_id,
                    wardId: wardMember.ward_id,
                    role: wardMember.role as WardMemberRole,
                    createdAt: wardMember.created_at
                })
        )
    }

    async findByWardId(wardId: string): Promise<WardMember[]> {
        const wardMembers = await prisma.ward_member.findMany({ where: { ward_id: wardId } })
        return wardMembers.map(
            (wardMember) =>
                new WardMember({
                    wardMemberId: wardMember.ward_member_id,
                    userId: wardMember.user_id,
                    wardId: wardMember.ward_id,
                    role: wardMember.role as WardMemberRole,
                    createdAt: wardMember.created_at
                })
        )
    }

    async findByUserIdAndWardId(userId: string, wardId: string): Promise<WardMember | null> {
        const wardMember = await prisma.ward_member.findUnique({ 
            where: {
                user_id_ward_id: {
                    user_id: userId,
                    ward_id: wardId
                }
            }
        })
        return wardMember
        ? new WardMember({
            wardMemberId: wardMember.ward_member_id,
            userId: wardMember.user_id,
            wardId: wardMember.ward_id,
            role: wardMember.role as WardMemberRole,
            createdAt: wardMember.created_at
        }) : null
    }

    async findAll(): Promise<WardMember[]> {
        const wardMembers = await prisma.ward_member.findMany()
        return wardMembers.map(
            (wardMember) =>
                new WardMember({
                    wardMemberId: wardMember.ward_member_id,
                    userId: wardMember.user_id,
                    wardId: wardMember.ward_id,
                    role: wardMember.role as WardMemberRole,
                    createdAt: wardMember.created_at
                })
        )
    }

    async delete(wardMemberId: string): Promise<void> {
        await prisma.ward_member.delete({ where: { ward_member_id: wardMemberId } })
    }
}