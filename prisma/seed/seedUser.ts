import { PrismaClient } from "@prisma/client";

export default async function seedUser(
    prisma: PrismaClient
) {
    try {
        console.log("🌱 Seeding User...");

         // เอา user กับ hospital มาก่อน (ต้องมีอยู่แล้ว)
        const user = await prisma.user.findFirst()
        const hospital = await prisma.hospital.findFirst()

        await prisma.user.createMany({
            data: [
                {
                    user_id: '0abc7cf2-6fb5-4d0f-afd5-4ec99aa33746',
                    first_name: 'admin',
                    last_name: 'admin',
                    personal_email: 'admin.admin@gmail.com',
                    google_email_id: '100242314638791242954',
                    line_user_id: '-',
                    hospital_id: hospital?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ]
        });

        console.log("✅ Seeding user completed.");
        
    } catch (error) {
        console.error("❌ Seeding user failed:", error);
        throw error;
    }
}