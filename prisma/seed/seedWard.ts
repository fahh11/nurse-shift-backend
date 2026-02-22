import { PrismaClient } from '@prisma/client';
import { WardStatus } from '@prisma/client';

export default async function seedWard(
    prisma: PrismaClient
) {
    try {
        console.log("🌱 Seeding wards...");

        // เอา user กับ hospital มาก่อน (ต้องมีอยู่แล้ว)
        const user = await prisma.user.findUnique({ where: { personal_email: 'admin.admin@gmail.com' } })
        const hospital = await prisma.hospital.findFirst()

        await prisma.ward.createMany({
            data: [
                {
                    ward_name: 'Ward A',
                    hospital_id: hospital!.hospital_id,
                    join_code: 'ABCBEFG2',
                    status: WardStatus.active,
                    created_by: user!.user_id,
                    updated_by: user!.user_id,
                },
                {
                    ward_name: 'Ward B',
                    hospital_id: hospital!.hospital_id,
                    join_code: 'ABCBEFG3',
                    status: WardStatus.active,
                    created_by: user!.user_id,
                    updated_by: user!.user_id,
                },
            ]
        })

        console.log("✅ Seeding wards completed.");
        
    } catch (error) {
        console.error("❌ Seeding wards failed:", error);
        throw error;
    }
}