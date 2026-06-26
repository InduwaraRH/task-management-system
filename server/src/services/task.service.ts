import prisma from '../prisma/client'

export const listTasks = async (opts: { userId?: string; isAdmin?: boolean; filters?: any }) => {
  // TODO: implement filtering, pagination, search, sorting based on opts.filters
  // For now, basic behavior: if isAdmin true, return all tasks, otherwise only tasks created by or assigned to userId
  if (opts.isAdmin) return prisma.task.findMany()
  return prisma.task.findMany({
    where: {
      OR: [{ createdById: opts.userId }, { assignedToId: opts.userId }],
    },
  })
}

export const getTask = async (id: string) => {
  return prisma.task.findUnique({ where: { id } })
}

export const createTask = async (data: any) => {
  // TODO: validate business rules
  return prisma.task.create({ data })
}

export const updateTask = async (id: string, data: any) => {
  return prisma.task.update({ where: { id }, data })
}

export const deleteTask = async (id: string) => {
  return prisma.task.delete({ where: { id } })
}
