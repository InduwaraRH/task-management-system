import { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service'
import { registerSchema, loginSchema } from '../validations/auth.validation'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation error', details: parsed.error.flatten() })
      return
    }
    const result = await authService.register(parsed.data)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation error', details: parsed.error.flatten() })
      return
    }
    const result = await authService.login(parsed.data.email, parsed.data.password)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.sub
    const result = await authService.me(userId)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const listUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.listUsers()
    res.json(result)
  } catch (err) {
    next(err)
  }
}