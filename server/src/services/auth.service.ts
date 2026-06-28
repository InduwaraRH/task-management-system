import prisma from '../prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config'

const signToken = (sub: string, role: string) =>
  jwt.sign({ sub, role }, JWT_SECRET, { expiresIn: '7d' })

const safeUser = (u: { id: string; name: string; email: string; role: string }) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
})

export const register = async (data: {
  name: string
  email: string
  password: string
  role?: 'ADMIN' | 'USER'
}) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) {
    const err: any = new Error('Email already registered')
    err.status = 409
    throw err
  }
  const hashed = await bcrypt.hash(data.password, 12)
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role ?? 'USER',
    },
  })
  const token = signToken(user.id, user.role)
  return { user: safeUser(user), token }
}

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    const err: any = new Error('Invalid credentials')
    err.status = 401
    throw err
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    const err: any = new Error('Invalid credentials')
    err.status = 401
    throw err
  }
  const token = signToken(user.id, user.role)
  return { user: safeUser(user), token }
}

export const me = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
  if (!user) {
    const err: any = new Error('User not found')
    err.status = 404
    throw err
  }
  return user
}

export const listUsers = async () =>
  prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: 'asc' },
  })