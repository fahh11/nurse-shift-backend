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
                    first_name: 'สมชาย',
                    last_name: 'ใจดี',
                    personal_email: 'user1@gmail.com',
                    google_email_id: '100242314638791242012',
                    hospital_id: hospitalA?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    user_id: 'c2a1d5e4-8c9f-47c2-9a6b-5e0f4a2d7b13',
                    first_name: 'สมหญิง',
                    last_name: 'พงษ์ทอง',
                    personal_email: 'user2@gmail.com',
                    google_email_id: '1002423146387912420123',
                    hospital_id: hospitalA?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    user_id: 'b4f8c1a2-3e7d-4c9a-8f2b-6d1e0a9c4321',
                    first_name: 'ณัฐวุฒิ',
                    last_name: 'ศรีสุข',
                    personal_email: 'user3@gmail.com',
                    google_email_id: '1002423146387912420124',
                    hospital_id: hospitalA?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    user_id: '3f9c2e1a-7b44-4d2a-9c3a-1f5a8b7c2d90',
                    first_name: 'พิมพ์ชนก',
                    last_name: 'วัฒนะ',
                    personal_email: 'user4@gmail.com',
                    google_email_id: '1002423146387912420125',
                    hospital_id: hospitalA?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    user_id: 'a7e1c5d2-9f3b-4c8e-b2a1-6d4f0e9c7a11',
                    first_name: 'กิตติพงศ์',
                    last_name: 'แสงแก้ว',
                    personal_email: 'user5@gmail.com',
                    google_email_id: '1002423146387912420126',
                    hospital_id: hospitalA?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    user_id: '7a3d2c1f-9e84-4b6a-b2d1-5f0c8e7a1234',
                    first_name: 'ธนกร',
                    last_name: 'สุขสวัสดิ์',
                    personal_email: 'user6@gmail.com',
                    google_email_id: '1002423146387912420127',
                    hospital_id: hospitalA?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    user_id: '1c9f4e2a-6b73-4d8c-a1f0-3e7b5d9a5678',
                    first_name: 'ชลธิชา',
                    last_name: 'อินทร์ทอง',
                    personal_email: 'user7@gmail.com',
                    google_email_id: '1002423146387912420128',
                    hospital_id: hospitalA?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    user_id: '5e2a7c9d-1f84-4b3a-8c6e-2d9f0a7b4321',
                    first_name: 'วีรภัทร',
                    last_name: 'กาญจนกิจ',
                    personal_email: 'user8@gmail.com',
                    google_email_id: '1002423146387912420129',
                    hospital_id: hospitalA?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    user_id: '9b7c2a1d-4e6f-4a8c-b3d1-7f0e2c5a6789',
                    first_name: 'ศิริลักษณ์',
                    last_name: 'นาคสกุล',
                    personal_email: 'user9@gmail.com',
                    google_email_id: '1002423146387912420130',
                    hospital_id: hospitalA?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    user_id: '3d8a1f7c-5b9e-4c2a-a6d1-8e0f7b2c9012',
                    first_name: 'ปกรณ์',
                    last_name: 'ภูมิใจ',
                    personal_email: 'user10@gmail.com',
                    google_email_id: '1002423146387912420131',
                    hospital_id: hospitalA?.hospital_id,
                    profile_completed: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
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