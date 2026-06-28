import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT ? Number(process.env.PORT) : 5000
export const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production'
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'