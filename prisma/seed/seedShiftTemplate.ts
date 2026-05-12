import { PrismaClient } from '@prisma/client';
import { ShiftTemplateType } from '@prisma/client';

export default async function seedShiftTemplate(
    prisma: PrismaClient,
) {
    try {
        // เอา ward มาก่อน (ต้องมีอยู่แล้ว)
        const ward1OfA = await prisma.ward.findFirst({
            where: {
                ward_name: "หอผู้ป่วยอายุรกรรม"
            }
        })

        const ward2OfA = await prisma.ward.findFirst({
            where: {
                ward_name: "หอผู้ป่วยศัลยกรรม"
            }
        })

        await prisma.shift_template.createMany({
            data: [
                // Create shift template in "Ward 1 of Hospital A"
                {
                    ward_id: ward1OfA!.ward_id,
                    type: ShiftTemplateType.morning,
                    start_time: "00:00",
                    end_time: "08:00",
                },
                {
                    ward_id: ward1OfA!.ward_id,
                    type: ShiftTemplateType.afternoon,
                    start_time: "08:00",
                    end_time: "16:00",
                },
                {
                    ward_id: ward1OfA!.ward_id,
                    type: ShiftTemplateType.night,
                    start_time: "16:00",
                    end_time: "23:00",
                },

                // Create shift template in "Ward 2 of Hospital A"
                {
                    ward_id: ward2OfA!.ward_id,
                    type: ShiftTemplateType.morning,
                    start_time: "00:00",
                    end_time: "08:00",
                },
                {
                    ward_id: ward2OfA!.ward_id,
                    type: ShiftTemplateType.afternoon,
                    start_time: "08:00",
                    end_time: "16:00",
                },
                {
                    ward_id: ward2OfA!.ward_id,
                    type: ShiftTemplateType.night,
                    start_time: "16:00",
                    end_time: "23:00",
                },
            ]
        })

        console.log("✅ Seeding shift templates completed.");
        
    } catch (error) {
        console.error("❌ Seeding shift templates failed:", error);
        throw error;
    }
}