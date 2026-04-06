import { PrismaClient } from '@prisma/client';
import { WardStatus } from '@prisma/client';

export default async function seedWard(
    prisma: PrismaClient,
) {
    try {
        // เอา user กับ hospital มาก่อน (ต้องมีอยู่แล้ว)
        const admin = await prisma.user.findFirst({ where: { personal_email: "admin.admin@gmail.com" }})

        const hospitalA = await prisma.hospital.findFirst({ where: { name: "โรงพยาบาลมหาวิทยาลัยเกษตรศาสตร์"} })
        const hospitalB = await prisma.hospital.findFirst({ where: { name: "โรงพยาบาลศิริราช"} })

        await prisma.ward.createMany({
            data: [
                // Ward of Hospital A
                {
                    ward_name: `หอผู้ป่วยอายุรกรรม`,
                    hospital_id: hospitalA!.hospital_id,
                    join_code: 'ABCBEFG2',
                    status: WardStatus.active,
                    created_by: admin!.user_id,
                    updated_by: admin!.user_id,
                },
                {
                    ward_name: `หอผู้ป่วยศัลยกรรม`,
                    hospital_id: hospitalA!.hospital_id,
                    join_code: 'ABCBEFG3',
                    status: WardStatus.active,
                    created_by: admin!.user_id,
                    updated_by: admin!.user_id,
                },

                // Ward of Hospital B
                {
                    ward_name:  `หอผู้ป่วยอายุรกรรม1`,
                    hospital_id: hospitalB!.hospital_id,
                    join_code: 'ABCBEFG4',
                    status: WardStatus.active,
                    created_by: admin!.user_id,
                    updated_by: admin!.user_id,
                },
                {
                    ward_name: `หอผู้ป่วยศัลยกรรม1`,
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