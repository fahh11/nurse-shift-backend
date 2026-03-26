import { PrismaClient } from '@prisma/client';
import { ShiftAssignment } from '@service/domain/entities/shiftAssignment';
import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository';
import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType';

const prisma = new PrismaClient();

export class PrismaShiftAssignmentRepository implements ShiftAssignmentRepository {
    async create(shiftAssignment: ShiftAssignment): Promise<ShiftAssignment> {
        const created = await prisma.shift_assignment.create({
            data: {
                shift_template_id: shiftAssignment.shiftTemplateId ?? null,
                ward_id: shiftAssignment.wardId,
                user_id: shiftAssignment.userId,
                date: shiftAssignment.date,
                assignment_type: shiftAssignment.assignmentType,
                created_by: shiftAssignment.createdBy,
                updated_by: shiftAssignment.updatedBy,
            }
        })

        return new ShiftAssignment({
            shiftAssignmentId: created.shift_assignment_id,
            shiftTemplateId: created.shift_template_id,
            wardId: created.ward_id,
            userId: created.user_id,
            date: created.date,
            assignmentType: created.assignment_type as ShiftAssignmentType,
            createdBy: created.created_by,
            updatedBy: created.updated_by,
            createdAt: created.created_at,
            updatedAt: created.updated_at,
        })
    }

    async findById(shiftAssignmentId: string): Promise<ShiftAssignment | null> {
        const shiftAssignment = await prisma.shift_assignment.findUnique({
            where: { shift_assignment_id: shiftAssignmentId }
        })

        return shiftAssignment
        ? new ShiftAssignment({
            shiftAssignmentId: shiftAssignment.shift_assignment_id,
            shiftTemplateId: shiftAssignment.shift_template_id,
            wardId: shiftAssignment.ward_id,
            userId: shiftAssignment.user_id,
            date: shiftAssignment.date,
            assignmentType: shiftAssignment.assignment_type as ShiftAssignmentType,
            createdBy: shiftAssignment.created_by,
            updatedBy: shiftAssignment.updated_by,
            createdAt: shiftAssignment.created_at,
            updatedAt: shiftAssignment.updated_at,
        }) : null
    }

    async findByUserIdAndDate(userId: string, date: Date): Promise<ShiftAssignment[]> {
        const shiftAssignments = await prisma.shift_assignment.findMany({ 
            where: {
                user_id: userId,
                date: date
            }
        })

        return shiftAssignments.map(
            (shiftAssignment) =>
                new ShiftAssignment({
                    shiftAssignmentId: shiftAssignment.shift_assignment_id,
                    shiftTemplateId: shiftAssignment.shift_template_id,
                    wardId: shiftAssignment.ward_id,
                    userId: shiftAssignment.user_id,
                    date: shiftAssignment.date,
                    assignmentType: shiftAssignment.assignment_type as ShiftAssignmentType,
                    createdBy: shiftAssignment.created_by,
                    updatedBy: shiftAssignment.updated_by,
                    createdAt: shiftAssignment.created_at,
                    updatedAt: shiftAssignment.updated_at,
                })
        )
    }

    async findAll(): Promise<ShiftAssignment[]> {
        const shiftAssignments = await prisma.shift_assignment.findMany()

        return shiftAssignments.map(
            (shiftAssignment) =>
                new ShiftAssignment({
                    shiftAssignmentId: shiftAssignment.shift_assignment_id,
                    shiftTemplateId: shiftAssignment.shift_template_id,
                    wardId: shiftAssignment.ward_id,
                    userId: shiftAssignment.user_id,
                    date: shiftAssignment.date,
                    assignmentType: shiftAssignment.assignment_type as ShiftAssignmentType,
                    createdBy: shiftAssignment.created_by,
                    updatedBy: shiftAssignment.updated_by,
                    createdAt: shiftAssignment.created_at,
                    updatedAt: shiftAssignment.updated_at,
                })
        )
    }

    async update(shiftAssignment: ShiftAssignment): Promise<ShiftAssignment> {
        const updated = await prisma.shift_assignment.update({
            where: { shift_assignment_id: shiftAssignment.shiftAssignmentId },
            data: {
                shift_template_id: shiftAssignment.shiftTemplateId,
                assignment_type: shiftAssignment.assignmentType,
                updated_at: new Date(),
            }
        })

        return new ShiftAssignment({
            shiftAssignmentId: updated.shift_assignment_id,
            shiftTemplateId: updated.shift_template_id,
            wardId: updated.ward_id,
            userId: updated.user_id,
            date: updated.date,
            assignmentType: updated.assignment_type as ShiftAssignmentType,
            createdBy: updated.created_by,
            updatedBy: updated.updated_by,
            createdAt: updated.created_at,
            updatedAt: updated.updated_at,
        })
    }

    async delete(shiftAssignmentId: string): Promise<void> {
        await prisma.shift_assignment.delete({
            where: { shift_assignment_id: shiftAssignmentId }
        })
    }
}