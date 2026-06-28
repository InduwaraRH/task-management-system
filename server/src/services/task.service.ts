import prisma from '../prisma/client'

type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
type Status = 'OPEN' | 'IN_PROGRESS' | 'TESTING' | 'DONE'

const withRelations = {
  include: {
    createdBy: { select: { id: true, name: true, email: true } },
    assignedTo: { select: { id: true, name: true, email: true } },
  },
}
export const listTasks = async (opts: {
  userId: string
  isAdmin: boolean
  filters?: {
    search?: string
    priority?: string
    status?: string
    assignedToId?: string
  }
}) => {
  const { userId, isAdmin, filters = {} } = opts
  const where: any = {}

  if (!isAdmin) {
    where.OR = [{ createdById: userId }, { assignedToId: userId }]
  }

  if (filters.search) {
    const searchClause: any = {
      title: { contains: filters.search },
    }
    if (where.OR) {
      where.AND = [{ OR: where.OR as any[] }, searchClause]
      delete where.OR
    } else {
      Object.assign(where, searchClause)
    }
  }

  if (filters.priority) where.priority = filters.priority as Priority
  if (filters.status) where.status = filters.status as Status
  if (filters.assignedToId) where.assignedToId = filters.assignedToId

  return prisma.task.findMany({
    where,
    ...withRelations,
    orderBy: { createdAt: 'desc' },
  })
}

export const getTask = async (id: string, requesterId: string, isAdmin: boolean) => {
  const task = await prisma.task.findUnique({ where: { id }, ...withRelations })
  if (!task) {
    const err: any = new Error('Task not found')
    err.status = 404
    throw err
  }
  if (!isAdmin && task.createdById !== requesterId && task.assignedToId !== requesterId) {
    const err: any = new Error('Forbidden')
    err.status = 403
    throw err
  }
  return task
}

export const createTask = async (data: {
  title: string
  description?: string
  priority?: Priority
  status?: Status
  dueDate?: string | null
  assignedToId?: string | null
  createdById: string
}) => {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority ?? 'MEDIUM',
      status: data.status ?? 'OPEN',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      createdById: data.createdById,
      assignedToId: data.assignedToId ?? null,
    },
    ...withRelations,
  })
}

export const updateTask = async (
  id: string,
  requesterId: string,
  isAdmin: boolean,
  data: {
    title?: string
    description?: string
    priority?: Priority
    status?: Status
    dueDate?: string | null
    assignedToId?: string | null
  }
) => {
  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) {
    const err: any = new Error('Task not found')
    err.status = 404
    throw err
  }
  if (!isAdmin && task.createdById !== requesterId) {
    const err: any = new Error('Only the task creator or admin can edit this task')
    err.status = 403
    throw err
  }
  return prisma.task.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
      ...(data.assignedToId !== undefined && { assignedToId: data.assignedToId }),
    },
    ...withRelations,
  })
}

export const deleteTask = async (id: string, requesterId: string, isAdmin: boolean) => {
  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) {
    const err: any = new Error('Task not found')
    err.status = 404
    throw err
  }
  if (!isAdmin && task.createdById !== requesterId) {
    const err: any = new Error('Only the task creator or admin can delete this task')
    err.status = 403
    throw err
  }
  await prisma.task.delete({ where: { id } })
}