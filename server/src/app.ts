import express from 'express'
import cors from 'cors'
import { logger } from './middleware/logger.middleware'
import { errorHandler } from './middleware/error.middleware'
import authRoutes from './routes/auth.routes'
import taskRoutes from './routes/task.routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

app.use('/auth', authRoutes)
app.use('/tasks', taskRoutes)

app.use(errorHandler)

export default app
