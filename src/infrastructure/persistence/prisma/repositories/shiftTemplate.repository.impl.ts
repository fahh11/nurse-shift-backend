import { PrismaClient } from '@prisma/client';
import { ShiftTemplate } from '@service/domain/entities/shiftTemplate';
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository';
import { ShiftTemplateType } from '@service/enums/shiftTemplateType';

const prisma = new PrismaClient();

export class PrismaShiftTemplateRepository implements ShiftTemplateRepository {
    async create(shiftTemplate: ShiftTemplate): Promise<ShiftTemplate> {
        const created = await prisma.shift_template.create({
            data: {
                ward_id: shiftTemplate.wardId,
                type: shiftTemplate.type,
                start_time: shiftTemplate.startTime,
                end_time: shiftTemplate.endTime,
            }
        })

        return new ShiftTemplate({
            shiftTemplateId: created.shift_template_id,
            wardId: created.ward_id,
            type: created.type as ShiftTemplateType,
            startTime: created.start_time,
            endTime: created.end_time,
            createdAt: created.created_at,
            updatedAt: created.updated_at,
        })
    }

    async findById(shiftTemplateId: string): Promise<ShiftTemplate | null> {
        const shiftTemplate = await prisma.shift_template.findUnique({ where: { shift_template_id: shiftTemplateId } })
        return shiftTemplate
        ? new ShiftTemplate({
            shiftTemplateId: shiftTemplate.shift_template_id,
            wardId: shiftTemplate.ward_id,
            type: shiftTemplate.type as ShiftTemplateType,
            startTime: shiftTemplate.start_time,
            endTime: shiftTemplate.end_time,
            createdAt: shiftTemplate.created_at,
            updatedAt: shiftTemplate.updated_at,
        }) : null
    }

    async findByWardId(wardId: string): Promise<ShiftTemplate[]> {
        const shiftTemplates = await prisma.shift_template.findMany({ where: { ward_id: wardId } })
        return shiftTemplates.map(
            (shiftTemplate) =>
                new ShiftTemplate({
                    shiftTemplateId: shiftTemplate.shift_template_id,
                    wardId: shiftTemplate.ward_id,
                    type: shiftTemplate.type as ShiftTemplateType,
                    startTime: shiftTemplate.start_time,
                    endTime: shiftTemplate.end_time,
                    createdAt: shiftTemplate.created_at,
                    updatedAt: shiftTemplate.updated_at,
                }) 
        )
    }

    async findAll(): Promise<ShiftTemplate[]> {
        const shiftTemplates = await prisma.shift_template.findMany()
        return shiftTemplates.map(
            (shiftTemplate) =>
                new ShiftTemplate({
                    shiftTemplateId: shiftTemplate.shift_template_id,
                    wardId: shiftTemplate.ward_id,
                    type: shiftTemplate.type as ShiftTemplateType,
                    startTime: shiftTemplate.start_time,
                    endTime: shiftTemplate.end_time,
                    createdAt: shiftTemplate.created_at,
                    updatedAt: shiftTemplate.updated_at,
                }) 
        )
    }

    async update(shiftTemplate: ShiftTemplate): Promise<ShiftTemplate> {
        const updated = await prisma.shift_template.update({
            where: { shift_template_id: shiftTemplate.shiftTemplateId },
            data: {
                start_time: shiftTemplate.startTime,
                end_time: shiftTemplate.endTime,
                updated_at: new Date(),
            }
        })

        return new ShiftTemplate({
            shiftTemplateId: updated.shift_template_id,
            wardId: updated.ward_id,
            type: updated.type as ShiftTemplateType,
            startTime: updated.start_time,
            endTime: updated.end_time,
            createdAt: updated.created_at,
            updatedAt: updated.updated_at,
        })
    }

    async delete(shiftTemplateId: string): Promise<void> {
        await prisma.shift_template.delete({ where: { shift_template_id: shiftTemplateId } })
    }
}