import { prisma } from '@service/lib/prisma'
import { ShiftRequirement } from '@service/domain/entities/shiftRequirement';
import { ShiftRequirementRepository } from '@service/domain/repositories/shiftRequirement.repository';

export class PrismaShiftRequirementRepository implements ShiftRequirementRepository {
    async create(shiftRequirement: ShiftRequirement): Promise<ShiftRequirement> {
        const created = await prisma.shift_requirement.create({
            data: {
                shift_template_id: shiftRequirement.shiftTemplateId,
                required_people: shiftRequirement.requiredPeople,
                effective_from: shiftRequirement.effectiveFrom,
                effective_to: shiftRequirement.effectiveTo,
            }
        })

        return new ShiftRequirement({
            shiftRequirementId: created.shift_requirement_id,
            shiftTemplateId: created.shift_template_id,
            requiredPeople: created.required_people,
            effectiveFrom: created.effective_from,
            effectiveTo: created.effective_to,
            createdAt: created.created_at,
            updatedAt: created.updated_at,
        })
    }

    async findById(shiftRequirementId: string): Promise<ShiftRequirement | null> {
        const shiftRequirement = await prisma.shift_requirement.findUnique({ 
            where: { shift_requirement_id: shiftRequirementId } 
        })
        return shiftRequirement
        ? new ShiftRequirement({
            shiftRequirementId: shiftRequirement.shift_requirement_id,
            shiftTemplateId: shiftRequirement.shift_template_id,
            requiredPeople: shiftRequirement.required_people,
            effectiveFrom: shiftRequirement.effective_from,
            effectiveTo: shiftRequirement.effective_to,
            createdAt: shiftRequirement.created_at,
            updatedAt: shiftRequirement.updated_at,
        }) : null
    }

    async findByShiftTemplateId(shiftTemplateId: string): Promise<ShiftRequirement[]> {
        const shiftRequirements = await prisma.shift_requirement.findMany({ 
            where: { shift_template_id: shiftTemplateId } 
        })

        return shiftRequirements.map(
            (shiftRequirement) =>
                new ShiftRequirement({
                    shiftRequirementId: shiftRequirement.shift_requirement_id,
                    shiftTemplateId: shiftRequirement.shift_template_id,
                    requiredPeople: shiftRequirement.required_people,
                    effectiveFrom: shiftRequirement.effective_from,
                    effectiveTo: shiftRequirement.effective_to,
                    createdAt: shiftRequirement.created_at,
                    updatedAt: shiftRequirement.updated_at,
                })
        )
    }

    async findActiveByShiftTemplateId(shiftTemplateId: string): Promise<ShiftRequirement | null> {
        const shiftRequirement = await prisma.shift_requirement.findFirst({
            where: {
                shift_template_id: shiftTemplateId,
                effective_to: null
            }
        })

        return shiftRequirement
        ? new ShiftRequirement({
            shiftRequirementId: shiftRequirement.shift_requirement_id,
            shiftTemplateId: shiftRequirement.shift_template_id,
            requiredPeople: shiftRequirement.required_people,
            effectiveFrom: shiftRequirement.effective_from,
            effectiveTo: shiftRequirement.effective_to,
            createdAt: shiftRequirement.created_at,
            updatedAt: shiftRequirement.updated_at,
        })
        : null
    }

    async findAll(): Promise<ShiftRequirement[]> {
        const shiftRequirements = await prisma.shift_requirement.findMany()

        return shiftRequirements.map(
            (shiftRequirement) =>
                new ShiftRequirement({
                    shiftRequirementId: shiftRequirement.shift_requirement_id,
                    shiftTemplateId: shiftRequirement.shift_template_id,
                    requiredPeople: shiftRequirement.required_people,
                    effectiveFrom: shiftRequirement.effective_from,
                    effectiveTo: shiftRequirement.effective_to,
                    createdAt: shiftRequirement.created_at,
                    updatedAt: shiftRequirement.updated_at,
                })
        )
    }

    async update(shiftRequirement: ShiftRequirement): Promise<ShiftRequirement> {
        const updated = await prisma.shift_requirement.update({
            where: { shift_requirement_id: shiftRequirement.shiftRequirementId },
            data: {
                effective_to: shiftRequirement.effectiveTo,
                updated_at: new Date(),
            }
        })

        return new ShiftRequirement({
            shiftRequirementId: updated.shift_requirement_id,
            shiftTemplateId: updated.shift_template_id,
            requiredPeople: updated.required_people,
            effectiveFrom: updated.effective_from,
            effectiveTo: updated.effective_to,
            createdAt: updated.created_at,
            updatedAt: updated.updated_at,
        })
    }

    async delete(shiftRequirementId: string): Promise<void> {
        await prisma.shift_requirement.delete({
            where: { shift_requirement_id: shiftRequirementId }
        })
    }
}