import { PrismaClient } from '@prisma/client';
import { WardMemberRole } from '@prisma/client';

export default async function seedWardMember(
    prisma: PrismaClient,
) {
    try {
        // เอา user กับ wardมาก่อน (ต้องมีอยู่แล้ว)
        const user1 = await prisma.user.findFirst({ where: { personal_email: "user1@gmail.com" }})
        const user2 = await prisma.user.findFirst({ where: { personal_email: "user2@gmail.com" }})

        const ward1OfA = await prisma.ward.findFirst({
            where: {
                ward_name: "Ward 1 of Hospital A"
            }
        })

        const ward2OfA = await prisma.ward.findFirst({
            where: {
                ward_name: "Ward 2 of Hospital A"
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
                // Member of "Ward of Hospital B"
            ]
        })

        console.log("✅ Seeding ward members completed.");
        
    } catch (error) {
        console.error("❌ Seeding ward members failed:", error);
        throw error;
    }
}