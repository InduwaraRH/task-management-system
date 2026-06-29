import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Task } from '../types'
import toast from 'react-hot-toast'

export const useTasks = (params?: Record<string, any>) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const res = await api.get('/tasks', { params })
      return res.data as Task[]
    },
  })
}

export const useCreateTask = () => {
  const qc = useQueryClient()
  return useMutation<Task, Error, Partial<Task>>({
    mutationFn: async (payload) => {
      const res = await api.post('/tasks', payload)
      return res.data as Task
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task created')
    },
    onError: () => toast.error('Failed to create task'),
  })
}

export const useUpdateTask = () => {
  const qc = useQueryClient()
  return useMutation<Task, Error, { id: string; data: Partial<Task> }>({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/tasks/${id}`, data)
      return res.data as Task
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['task'] })
      toast.success('Task updated')
    },
    onError: () => toast.error('Failed to update task'),
  })
}

export const useDeleteTask = () => {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/tasks/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task deleted')
    },
    onError: () => toast.error('Failed to delete task'),
  })
}

export const useUsers = () => {
  return useQuery<{ id: string; name: string; email: string }[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/auth/users')
      return res.data
    },
  })
}