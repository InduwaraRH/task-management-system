import { Request, Response, NextFunction } from 'express'
import * as taskService from '../services/task.service'
import { createTaskSchema, updateTaskSchema, taskFilterSchema } from '../validations/task.validation'

const getUser = (req: Request) => (req as any).user as { sub: string; role: string }

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getUser(req)
    const parsed = taskFilterSchema.safeParse(req.query)
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid filters', details: parsed.error.flatten() })
      return
    }
    const result = await taskService.listTasks({
      userId: user.sub,
      isAdmin: user.role === 'ADMIN',
      filters: parsed.data,
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getUser(req)
    const result = await taskService.getTask(req.params.id, user.sub, user.role === 'ADMIN')
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getUser(req)
    const parsed = createTaskSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation error', details: parsed.error.flatten() })
      return
    }
    const result = await taskService.createTask({ ...parsed.data, createdById: user.sub })
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getUser(req)
    const parsed = updateTaskSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation error', details: parsed.error.flatten() })
      return
    }
    const result = await taskService.updateTask(
      req.params.id,
      user.sub,
      user.role === 'ADMIN',
      parsed.data
    )
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getUser(req)
    await taskService.deleteTask(req.params.id, user.sub, user.role === 'ADMIN')
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}