import { PrismaClient } from "@prisma/client";
import { Ward } from "@service/domain/entities/ward";
import { WardRepository } from "@service/domain/repositories/ward.repository";
import { WardStatus } from "@service/enums/wardStatus";

const prisma = new PrismaClient();

export class PrismaWardRepository implements WardRepository {
    async create(ward: Ward): Promise<Ward> {
        const created = await prisma.ward.create({
            data: {
                ward_name: ward.wardName,
                hospital_id: ward.hospitalId,
                join_code: ward.joinCode,
                join_code_status: ward.joinCodeStatus,
                status: ward.status,
                created_by: ward.createdBy,
                updated_by: ward.updatedBy,
            },
        })

        return new Ward({
            wardId: created.ward_id,
            wardName: created.ward_name,
            hospitalId: created.hospital_id,
            joinCode: created.join_code,
            joinCodeStatus: created.join_code_status,
            status: created.status as WardStatus,
            createdBy: created.created_by,
            updatedBy: created.updated_by,
            createdAt: created.created_at,
            updatedAt: created.updated_at,
        })
    }

    async findById(wardId: string): Promise<Ward | null> {
        const ward = await prisma.ward.findUnique({ where: { ward_id: wardId} })
        return ward
        ? new Ward({
            wardId: ward.ward_id,
            wardName: ward.ward_name,
            hospitalId: ward.hospital_id,
            joinCode: ward.join_code,
            joinCodeStatus: ward.join_code_status,
            status: ward.status as WardStatus,
            createdBy: ward.created_by,
            updatedBy: ward.updated_by,
            createdAt: ward.created_at,
            updatedAt: ward.updated_at,
        }) : null
    }

    async findByHospitalId(hospitalId: string): Promise<Ward[]> {
        const wards = await prisma.ward.findMany({ where: { hospital_id: hospitalId } })
        return wards.map(
            (ward) => 
                new Ward({
                    wardId: ward.ward_id,
                    wardName: ward.ward_name,
                    hospitalId: ward.hospital_id,
                    joinCode: ward.join_code,
                    joinCodeStatus: ward.join_code_status,
                    status: ward.status as WardStatus,
                    createdBy: ward.created_by,
                    updatedBy: ward.updated_by,
                    createdAt: ward.created_at,
                    updatedAt: ward.updated_at,
                })
        )
    }

    async findAll(): Promise<Ward[]> {
        const wards = await prisma.ward.findMany()
        return wards.map(
            (ward) => 
                new Ward({
                    wardId: ward.ward_id,
                    wardName: ward.ward_name,
                    hospitalId: ward.hospital_id,
                    joinCode: ward.join_code,
                    joinCodeStatus: ward.join_code_status,
                    status: ward.status as WardStatus,
                    createdBy: ward.created_by,
                    updatedBy: ward.updated_by,
                    createdAt: ward.created_at,
                    updatedAt: ward.updated_at,
                })
        )
    }

    async update(ward: Ward): Promise<Ward> {
        const updated = await prisma.ward.update({
            where: { ward_id: ward.wardId },
            data: {
                ward_name: ward.wardName,
                hospital_id: ward.hospitalId,
                join_code_status: ward.joinCodeStatus,
                status: ward.status,
                updated_at: new Date(),
            },
        })

        return new Ward({
            wardId: updated.ward_id,
            wardName: updated.ward_name,
            hospitalId: updated.hospital_id,
            joinCode: updated.join_code,
            joinCodeStatus: updated.join_code_status,
            status: updated.status as WardStatus,
            createdBy: updated.created_by,
            updatedBy: updated.updated_by,
            createdAt: updated.created_at,
            updatedAt: updated.updated_at,
        })
    }

    async delete(wardId: string): Promise<void> {
        await prisma.ward.delete({ where: { ward_id: wardId } })
    }
}