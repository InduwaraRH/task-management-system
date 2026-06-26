import { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service'
import { registerSchema, loginSchema } from '../validations/auth.validation'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body)
    const result = await authService.register(data)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body)
    const result = await authService.login(data.email, data.password)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    const result = await authService.me(user.sub)
    res.json(result)
  } catch (err) {
    next(err)
  }
}
