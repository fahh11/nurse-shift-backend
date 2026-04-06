import { PrismaClient } from "@prisma/client";

export default async function seedHospital(
    prisma: PrismaClient
) {
    try {
        await prisma.hospital.createMany({
            data: [
            {
                name: 'โรงพยาบาลมหาวิทยาลัยเกษตรศาสตร์',
                address: 'เขตจตุจักร กรุงเทพมหานคร',
            },
            {
                name: 'โรงพยาบาลศิริราช',
                address: 'เขตบางกอกน้อย กรุงเทพมหานคร',
            },
            {
                name: 'โรงพยาบาลรามาธิบดี',
                address: 'เขตราชเทวี กรุงเทพมหานคร',
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