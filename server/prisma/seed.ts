import { PrismaClient, Role, Priority, Status } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: { name: 'Admin', email: 'admin@example.com', password, role: Role.ADMIN },
  })

  const userA = await prisma.user.create({
    data: { name: 'Alice', email: 'alice@example.com', password, role: Role.USER },
  })

  const userB = await prisma.user.create({
    data: { name: 'Bob', email: 'bob@example.com', password, role: Role.USER },
  })

  for (let i = 1; i <= 10; i++) {
    await prisma.task.create({
      data: {
        title: `Seed Task ${i}`,
        description: `This is seed task ${i}`,
        priority: i % 3 === 0 ? Priority.HIGH : Priority.MEDIUM,
        status: i % 2 === 0 ? Status.OPEN : Status.IN_PROGRESS,
        createdById: i % 2 === 0 ? userA.id : userB.id,
        assignedToId: i % 2 === 0 ? userB.id : userA.id,
      },
    })
  }

  console.log('Seed data created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
