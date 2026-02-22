import { PrismaClient } from '@prisma/client'
import seedHospital from './seedHospital'
import seedWard from './seedWard'
import seedUser from './seedUser'

const prisma = new PrismaClient()

async function clearDatabase(prisma: PrismaClient) {
  await prisma.$transaction([
    prisma.ward_member.deleteMany(),
    prisma.ward.deleteMany(),
    prisma.hospital.deleteMany(),
    prisma.user.deleteMany(),
  ])
}

async function main() {
  try {
    console.log('🌱 Start seeding...')

    const users = await seedUser(prisma)
    const hospitals = await seedHospital(prisma)
    const wards = await seedWard(prisma)

    console.log('✅ Seeding completed successfully!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error;
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })