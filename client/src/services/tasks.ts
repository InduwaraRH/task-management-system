import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Task } from '../types'

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
    mutationFn: async (payload: Partial<Task>) => {
      const res = await api.post('/tasks', payload)
      return res.data as Task
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}
