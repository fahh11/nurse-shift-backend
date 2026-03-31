import { PrismaClient } from '@prisma/client';
import { ShiftAssignmentType } from '@prisma/client';
import { ShiftTemplateType } from '@prisma/client';

export default async function seedShiftAssignment(
    prisma: PrismaClient,
) {
    try {
        // เอา user, ward, shift template มาก่อน (ต้องมีอยู่แล้ว)
        const admin = await prisma.user.findFirst({ where: { personal_email: "admin.admin@gmail.com" }})
        const user1 = await prisma.user.findFirst({ where: { personal_email: "user1@gmail.com" }})
        const user2 = await prisma.user.findFirst({ where: { personal_email: "user2@gmail.com" }})

         const ward1OfA = await prisma.ward.findFirst({
            where: {
                ward_name: "Ward 1 of Hospital A"
            }
        })

        const morningOfWard1A = await prisma.shift_template.findFirst({
            where: {
                ward: {
                    ward_name: "Ward 1 of Hospital A"
                },
                type: ShiftTemplateType.morning
            }
        })

        const afternoonOfWard1A = await prisma.shift_template.findFirst({
            where: {
                ward: {
                    ward_name: "Ward 1 of Hospital A"
                },
                type: ShiftTemplateType.afternoon
            }
        })

        const nightOfWard1A = await prisma.shift_template.findFirst({
            where: {
                ward: {
                    ward_name: "Ward 1 of Hospital A"
                },
                type: ShiftTemplateType.night
            }
        })

        await prisma.shift_assignment.createMany({
            data: [
                // Create shift assignment in "Ward 1 of Hospital A"
                {
                    shift_template_id: morningOfWard1A!.shift_template_id,
                    ward_id: ward1OfA!.ward_id,
                    user_id: user1!.user_id,
                    date: new Date("2026-01-01"),
                    assignment_type: ShiftAssignmentType.shift,
                    created_by: admin!.user_id,
                    updated_by: admin!.user_id,
                },
                {
                    shift_template_id: afternoonOfWard1A!.shift_template_id,
                    ward_id: ward1OfA!.ward_id,
                    user_id: user1!.user_id,
                    date: new Date("2026-01-01"),
                    assignment_type: ShiftAssignmentType.shift,
                    created_by: admin!.user_id,
                    updated_by: admin!.user_id,
                },
                {
                    shift_template_id: null,
                    ward_id: ward1OfA!.ward_id,
                    user_id: user2!.user_id,
                    date: new Date("2026-01-01"),
                    assignment_type: ShiftAssignmentType.off,
                    created_by: admin!.user_id,
                    updated_by: admin!.user_id,
                },
            ]
        })

        console.log("✅ Seeding shift assignments completed.");
        
    } catch (error) {
        console.error("❌ Seeding shift assignments failed:", error);
        throw error;
    }
}