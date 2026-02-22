import { PrismaClient } from "@prisma/client";

export default async function seedHospital(
    prisma: PrismaClient
) {
    try {
        console.log("🌱 Seeding hospitals...");

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
        
    } catch (error) {
        console.error("❌ Seeding hospitals failed:", error);
        throw error;
    }
}