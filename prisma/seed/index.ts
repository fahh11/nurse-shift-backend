import { PrismaClient } from '@prisma/client'
import seedHospital from './seedHospital'
import seedWard from './seedWard'

const prisma = new PrismaClient()


async function main() {
  try {
    console.log('🌱 Start seeding...')

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