import { PrismaClient } from "@prisma/client";

export default async function seedUser(
    prisma: PrismaClient,
) {
    try {
         // เอา hospital มาก่อน (ต้องมีอยู่แล้ว)
        const hospitalA = await prisma.hospital.findFirst({ where: { name: "Hospital A"} })

        await prisma.user.createMany({
            data: [
                // user in "Hospital A"
                {
                    user_id: '0abc7cf2-6fb5-4d0f-afd5-4ec99aa33746',
                    first_name: 'admin',
                    last_name: 'admin',
                    personal_email: 'admin.admin@gmail.com',
                    google_email_id: '100242314638791242954',
                    hospital_id: hospitalA?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    user_id: '8f6e7b9e-3d3c-4a9e-9b7e-2a7b3f6d1c41',
                    first_name: 'user1',
                    last_name: 'user1',
                    personal_email: 'user1@gmail.com',
                    google_email_id: '100242314638791242012',
                    hospital_id: hospitalA?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    user_id: 'c2a1d5e4-8c9f-47c2-9a6b-5e0f4a2d7b13',
                    first_name: 'user2',
                    last_name: 'user2',
                    personal_email: 'user2@gmail.com',
                    google_email_id: '1002423146387912420123',
                    hospital_id: hospitalA?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ]
        });

        console.log("✅ Seeding user completed.");

        // 🔥 ดึงข้อมูลที่เพิ่งสร้างกลับมา
        const users = await prisma.user.findMany()

        return users
        
    } catch (error) {
        console.error("❌ Seeding user failed:", error);
        throw error;
    }
}