import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'TESTING', 'DONE']).default('OPEN'),
  dueDate: z.string().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
})

export const updateTaskSchema = createTaskSchema.partial()

export const taskFilterSchema = z.object({
  search: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'TESTING', 'DONE']).optional(),
  assignedToId: z.string().optional(),
})