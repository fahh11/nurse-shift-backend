import { PrismaClient } from '@prisma/client'
import seedHospital from './seedHospital'
import seedUser from './seedUser'
import seedWard from './seedWard'
import seedWardMember from './seedWardMember'
import seedShiftTemplate from './seedShiftTemplate'
import seedShiftRequirement from './seedShiftRequirement'
import seedShiftAssignment from './seedShiftAssignment'

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

    await seedHospital(prisma)
    await seedUser(prisma)
    await seedWard(prisma)
    await seedWardMember(prisma)
    await seedShiftTemplate(prisma)
    await seedShiftRequirement(prisma)
    await seedShiftAssignment(prisma)

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