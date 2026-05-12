import { PrismaClient } from '@prisma/client';
import { ShiftTemplateType } from '@prisma/client';

export default async function seedShiftRequirement(
    prisma: PrismaClient,
) {
    try {
        // เอา shift template มาก่อน (ต้องมีอยู่แล้ว)
        const morningOfWard1A = await prisma.shift_template.findFirst({
            where: {
                ward: {
                    ward_name: "หอผู้ป่วยอายุรกรรม"
                },
                type: ShiftTemplateType.morning
            }
        })

        const afternoonOfWard1A = await prisma.shift_template.findFirst({
            where: {
                ward: {
                    ward_name: "หอผู้ป่วยอายุรกรรม"
                },
                type: ShiftTemplateType.afternoon
            }
        })

        const nightOfWard1A = await prisma.shift_template.findFirst({
            where: {
                ward: {
                    ward_name: "หอผู้ป่วยอายุรกรรม"
                },
                type: ShiftTemplateType.night
            }
        })

        const morningOfWard2A = await prisma.shift_template.findFirst({
            where: {
                ward: {
                    ward_name: "หอผู้ป่วยศัลยกรรม"
                },
                type: ShiftTemplateType.morning
            }
        })

        const afternoonOfWard2A = await prisma.shift_template.findFirst({
            where: {
                ward: {
                    ward_name: "หอผู้ป่วยศัลยกรรม"
                },
                type: ShiftTemplateType.afternoon
            }
        })

        const nightOfWard2A = await prisma.shift_template.findFirst({
            where: {
                ward: {
                    ward_name: "หอผู้ป่วยศัลยกรรม"
                },
                type: ShiftTemplateType.night
            }
        })

        await prisma.shift_requirement.createMany({
            data: [
                // Create shift requirement in "Ward 1 of Hospital A"
                {
                    shift_template_id: morningOfWard1A!.shift_template_id,
                    required_people: 2,
                    effective_from: new Date(),
                    effective_to: null
                },
                {
                    shift_template_id: afternoonOfWard1A!.shift_template_id,
                    required_people: 3,
                    effective_from: new Date(),
                    effective_to: null
                },
                {
                    shift_template_id: nightOfWard1A!.shift_template_id,
                    required_people: 2,
                    effective_from: new Date(),
                    effective_to: null
                },

                // Create shift requirement in "Ward 2 of Hospital A"
                {
                    shift_template_id: morningOfWard2A!.shift_template_id,
                    required_people: 3,
                    effective_from: new Date(),
                    effective_to: null
                },
                {
                    shift_template_id: afternoonOfWard2A!.shift_template_id,
                    required_people: 4,
                    effective_from: new Date(),
                    effective_to: null
                },
                {
                    shift_template_id: nightOfWard2A!.shift_template_id,
                    required_people: 5,
                    effective_from: new Date(),
                    effective_to: null
                },
            ]
        })

        console.log("✅ Seeding shift requirements completed.");
        
    } catch (error) {
        console.error("❌ Seeding shift requirements failed:", error);
        throw error;
    }
}