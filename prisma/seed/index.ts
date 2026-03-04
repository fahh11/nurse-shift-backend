import { PrismaClient } from '@prisma/client'
import seedHospital from './seedHospital'
import seedWard from './seedWard'
import seedUser from './seedUser'

const prisma = new PrismaClient()

async function clearDatabase(prisma: PrismaClient) {
  await prisma.$transaction([
    prisma.shift_swap_request.deleteMany(),
    prisma.shift_assignment.deleteMany(),
    prisma.shift_requirement.deleteMany(),
    prisma.shift_template.deleteMany(),
    prisma.ward_member.deleteMany(),
    prisma.ward.deleteMany(),
    prisma.user.deleteMany(),
    prisma.hospital.deleteMany(),
  ])
}

async function main() {
  try {
    console.log('🌱 Start seeding...')

    await clearDatabase(prisma)

    const hospitals = await seedHospital(prisma)
    const users = await seedUser(prisma, hospitals[0].hospital_id)
    const wards = await seedWard(prisma, hospitals[0].hospital_id, users[0].user_id)

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