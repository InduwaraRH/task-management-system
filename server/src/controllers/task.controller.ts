import { Request, Response, NextFunction } from 'express'
import * as taskService from '../services/task.service'

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user
    const isAdmin = user?.role === 'ADMIN'
    const result = await taskService.listTasks({ userId: user?.sub, isAdmin, filters: req.query })
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await taskService.getTask(id)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user
    // ensure createdById is set to current user
    const payload = { ...req.body, createdById: user?.sub }
    const result = await taskService.createTask(payload)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await taskService.updateTask(id, req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await taskService.deleteTask(id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
