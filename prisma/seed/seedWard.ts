import { PrismaClient } from '@prisma/client';
import { WardStatus } from '@prisma/client';

export default async function seedWard(
    prisma: PrismaClient,
) {
    try {
        // เอา user กับ hospital มาก่อน (ต้องมีอยู่แล้ว)
        const admin = await prisma.user.findFirst({ where: { personal_email: "admin.admin@gmail.com" }})

        const hospitalA = await prisma.hospital.findFirst({ where: { name: "Hospital A"} })
        const hospitalB = await prisma.hospital.findFirst({ where: { name: "Hospital B"} })

        await prisma.ward.createMany({
            data: [
                // Ward of Hospital A
                {
                    ward_name: 'Ward 1 of Hospital A',
                    hospital_id: hospitalA!.hospital_id,
                    join_code: 'ABCBEFG2',
                    status: WardStatus.active,
                    created_by: admin!.user_id,
                    updated_by: admin!.user_id,
                },
                {
                    ward_name: 'Ward 2 of Hospital A',
                    hospital_id: hospitalA!.hospital_id,
                    join_code: 'ABCBEFG3',
                    status: WardStatus.active,
                    created_by: admin!.user_id,
                    updated_by: admin!.user_id,
                },

                // Ward of Hospital B
                {
                    ward_name: 'Ward 1 of Hospital B',
                    hospital_id: hospitalB!.hospital_id,
                    join_code: 'ABCBEFG4',
                    status: WardStatus.active,
                    created_by: admin!.user_id,
                    updated_by: admin!.user_id,
                },
                {
                    ward_name: 'Ward 2 of Hospital B',
                    hospital_id: hospitalB!.hospital_id,
                    join_code: 'ABCBEFG5',
                    status: WardStatus.active,
                    created_by: admin!.user_id,
                    updated_by: admin!.user_id,
                },
            ]
        })

        console.log("✅ Seeding wards completed.");
        
    } catch (error) {
        console.error("❌ Seeding wards failed:", error);
        throw error;
    }
}