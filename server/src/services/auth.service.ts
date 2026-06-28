import prisma from '../prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'

export const register = async (data: { name: string; email: string; password: string }) => {
  // TODO: add additional business rules (unique email check already enforced by Prisma)
  const hashed = await bcrypt.hash(data.password, 10)
  const user = await prisma.user.create({ data: { name: data.name, email: data.email, password: hashed } })
  // create token
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token }
}

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw { status: 401, message: 'Invalid credentials' }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw { status: 401, message: 'Invalid credentials' }
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token }
}

export const me = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, role: true } })
  return user
}
