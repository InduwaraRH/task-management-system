export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'OPEN' | 'IN_PROGRESS' | 'TESTING' | 'DONE'
  dueDate?: string
  createdBy: string
  assignedTo?: string
  createdAt: string
  updatedAt?: string
}
