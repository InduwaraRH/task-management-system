import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('user123', 12)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@taskflow.dev',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const member = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@taskflow.dev',
      password: userPassword,
      role: 'USER',
    },
  })

  const member2 = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      email: 'alex@taskflow.dev',
      password: userPassword,
      role: 'USER',
    },
  })

  // Create tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment to production.',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        createdById: admin.id,
        assignedToId: member.id,
      },
      {
        title: 'Fix authentication bug on mobile',
        description: 'Users on iOS 17 are getting logged out after 5 minutes. Needs immediate investigation.',
        priority: 'HIGH',
        status: 'OPEN',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day — will show overdue soon
        createdById: admin.id,
        assignedToId: member2.id,
      },
      {
        title: 'Write API documentation',
        description: 'Document all REST endpoints using OpenAPI/Swagger spec.',
        priority: 'MEDIUM',
        status: 'OPEN',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        createdById: member.id,
        assignedToId: member.id,
      },
      {
        title: 'Design onboarding flow',
        description: 'Create wireframes for the new user onboarding experience.',
        priority: 'MEDIUM',
        status: 'TESTING',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdById: admin.id,
        assignedToId: member2.id,
      },
      {
        title: 'Update dependencies',
        description: 'Audit and update all npm packages to their latest stable versions.',
        priority: 'LOW',
        status: 'OPEN',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        createdById: member2.id,
        assignedToId: null,
      },
      {
        title: 'Performance audit',
        description: 'Run Lighthouse audit and fix any issues scoring below 90.',
        priority: 'LOW',
        status: 'DONE',
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // already done
        createdById: admin.id,
        assignedToId: member.id,
      },
    ],
  })

  console.log('✅ Seed complete!')
  console.log('')
  console.log('  Admin login:  admin@taskflow.dev / admin123')
  console.log('  User login:   jane@taskflow.dev  / user123')
  console.log('  User login:   alex@taskflow.dev  / user123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => await prisma.$disconnect())