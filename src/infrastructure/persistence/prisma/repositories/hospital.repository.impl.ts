import { PrismaClient } from "@prisma/client";
import { Hospital } from "@service/domain/entities/hospital";
import { HospitalRepository } from "@service/domain/repositories/hospital.repository";

const prisma = new PrismaClient();

export class PrismaHospitalRepository implements HospitalRepository {
    async create(hospital: Hospital): Promise<Hospital> {
        const created = await prisma.hospital.create({
            data: {
                name: hospital.name,
                address: hospital.address,
            },
        })

        return new Hospital({
            hospitalId: created.hospital_id,
            name: created.name,
            address: created.address,
            createdAt: created.created_at,
            updatedAt: created.updated_at,
        })
    }

    async findById(hospitalId: string): Promise<Hospital | null> {
        const hospital = await prisma.hospital.findUnique({ where: { hospital_id: hospitalId } })
        return hospital
        ? new Hospital({
            hospitalId: hospital.hospital_id,
            name: hospital.name,
            address: hospital.address,
            createdAt: hospital.created_at,
            updatedAt: hospital.updated_at,
        })
        : null
    }

    async findAll(): Promise<Hospital[]> {
        const hospitals = await prisma.hospital.findMany()
        return hospitals.map(
            (hospital) => 
                new Hospital({
                    hospitalId: hospital.hospital_id,
                    name: hospital.name,
                    address: hospital.address,
                    createdAt: hospital.created_at,
                    updatedAt: hospital.updated_at,
                })
        )
    }

    async update(hospital: Hospital): Promise<Hospital> {
        const updated = await prisma.hospital.update({
            where: { hospital_id: hospital.hospitalId },
            data: {
                name: hospital.name,
                address: hospital.address,
                updated_at: new Date(),
            },
        })

        return new Hospital({
            hospitalId: updated.hospital_id,
            name: updated.name,
            address: updated.address,
            createdAt: updated.created_at,
            updatedAt: updated.updated_at,
        })
    }

    async delete(hospitalId: string): Promise<void> {
        await prisma.hospital.delete({ where: { hospital_id: hospitalId } })
    }
}