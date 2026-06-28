import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' })
    return
  }
  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; role: string }
    ;(req as any).user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}