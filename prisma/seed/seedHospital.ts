import { PrismaClient } from "@prisma/client";

export default async function seedHospital(
    prisma: PrismaClient
) {
    try {
        await prisma.hospital.createMany({
            data: [
                {
                    name: 'Hospital A',
                    address: 'Location of Hospital A',
                },
                {
                    name: 'Hospital B',
                    address: 'Location of Hospital B',
                },
            ]
        });

        console.log("✅ Seeding hospitals completed.");

        // 🔥 ดึงข้อมูลที่เพิ่งสร้างกลับมา
        const hospitals = await prisma.hospital.findMany()

        return hospitals 
        
    } catch (error) {
        console.error("❌ Seeding hospitals failed:", error);
        throw error;
    }
}