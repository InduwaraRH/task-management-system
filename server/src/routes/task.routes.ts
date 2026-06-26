import { Router } from 'express'
import * as taskController from '../controllers/task.controller'
import { authenticate } from '../middleware/authenticate'

const router = Router()

router.use(authenticate)

router.get('/', taskController.list)
router.get('/:id', taskController.get)
router.post('/', taskController.create)
router.put('/:id', taskController.update)
router.delete('/:id', taskController.remove)

export default router
