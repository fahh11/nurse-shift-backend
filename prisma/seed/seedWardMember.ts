import { PrismaClient } from '@prisma/client';
import { WardMemberRole } from '@prisma/client';

export default async function seedWardMember(
    prisma: PrismaClient,
) {
    try {
        // เอา user กับ wardมาก่อน (ต้องมีอยู่แล้ว)
        const user1 = await prisma.user.findFirst({ where: { personal_email: "user1@gmail.com" }})
        const user2 = await prisma.user.findFirst({ where: { personal_email: "user2@gmail.com" }})
        const user3 = await prisma.user.findFirst({ where: { personal_email: "user3@gmail.com" }})
        const user4 = await prisma.user.findFirst({ where: { personal_email: "user4@gmail.com" }})
        const user5 = await prisma.user.findFirst({ where: { personal_email: "user5@gmail.com" }})
        const user6 = await prisma.user.findFirst({ where: { personal_email: "user6@gmail.com" }})
        const user7 = await prisma.user.findFirst({ where: { personal_email: "user7@gmail.com" }})
        const user8 = await prisma.user.findFirst({ where: { personal_email: "user8@gmail.com" }})
        const user9 = await prisma.user.findFirst({ where: { personal_email: "user9@gmail.com" }})
        const user10 = await prisma.user.findFirst({ where: { personal_email: "user10@gmail.com" }})

        const ward1OfA = await prisma.ward.findFirst({
            where: {
                ward_name: "หอผู้ป่วยอายุรกรรม"
            }
        })

        const ward2OfA = await prisma.ward.findFirst({
            where: {
                ward_name: "หอผู้ป่วยศัลยกรรม"
            }
        })

        await prisma.ward_member.createMany({
            data: [
                // Member of "Ward of Hospital A"
                {
                    user_id: user1!.user_id,
                    ward_id: ward1OfA!.ward_id,
                    role: WardMemberRole.nurse,
                },
                {
                    user_id: user2!.user_id,
                    ward_id: ward1OfA!.ward_id,
                    role: WardMemberRole.nurse,
                },
                {
                    user_id: user3!.user_id,
                    ward_id: ward1OfA!.ward_id,
                    role: WardMemberRole.nurse,
                },
                {
                    user_id: user4!.user_id,
                    ward_id: ward1OfA!.ward_id,
                    role: WardMemberRole.nurse,
                },
                // {
                //     user_id: user5!.user_id,
                //     ward_id: ward1OfA!.ward_id,
                //     role: WardMemberRole.nurse,
                // },
                // {
                //     user_id: user6!.user_id,
                //     ward_id: ward1OfA!.ward_id,
                //     role: WardMemberRole.nurse,
                // },
                // {
                //     user_id: user7!.user_id,
                //     ward_id: ward1OfA!.ward_id,
                //     role: WardMemberRole.nurse,
                // },
                // {
                //     user_id: user8!.user_id,
                //     ward_id: ward1OfA!.ward_id,
                //     role: WardMemberRole.nurse,
                // },
                // {
                //     user_id: user9!.user_id,
                //     ward_id: ward1OfA!.ward_id,
                //     role: WardMemberRole.nurse,
                // },
                // {
                //     user_id: user10!.user_id,
                //     ward_id: ward1OfA!.ward_id,
                //     role: WardMemberRole.nurse,
                // }
                // Member of "Ward of Hospital B"
            ]
        })

        console.log("✅ Seeding ward members completed.");
        
    } catch (error) {
        console.error("❌ Seeding ward members failed:", error);
        throw error;
    }
}