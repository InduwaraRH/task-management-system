import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../../lib/api'
import { Task } from '../../types'
import { useAuth } from '../../context/AuthContext'
import { useDeleteTask } from '../../services/tasks'
import TaskModal from '../../components/common/TaskModal'
import StatusDropdown from '../../components/common/StatusDropdown'
import Button from '../../components/common/Button'

const priorityConfig = {
  LOW:    { label: 'Low',    className: 'bg-slate-700 text-slate-300' },
  MEDIUM: { label: 'Medium', className: 'bg-amber-900/50 text-amber-300' },
  HIGH:   { label: 'High',   className: 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30' },
}

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const deleteTask = useDeleteTask()
  const [showEdit, setShowEdit] = useState(false)

  const { data: task, isLoading, error } = useQuery<Task>({
    queryKey: ['task', id],
    queryFn: async () => {
      const res = await api.get(`/tasks/${id}`)
      return res.data
    },
    enabled: !!id,
  })

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return
    await deleteTask.mutateAsync(id!)
    navigate('/dashboard')
  }

  if (isLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
    </div>
  )

  if (error || !task) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
      <div className="text-center">
        <p className="text-lg font-medium text-white">Task not found</p>
        <button onClick={() => navigate('/dashboard')} className="mt-3 text-sm text-cyan-400 hover:text-cyan-300">
          Back to dashboard
        </button>
      </div>
    </div>
  )

  const isOwner = user?.role === 'ADMIN' || (task as any).createdBy?.id === user?.id
  const priority = priorityConfig[task.priority]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Back to dashboard
          </button>
          {isOwner && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setShowEdit(true)} className="text-xs px-3 py-1.5">
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete} className="text-xs px-3 py-1.5">
                Delete
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Title + priority */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {task.priority === 'HIGH' && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose-400" />}
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">{task.title}</h1>
          </div>
          <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priority.className}`}>
            {priority.label}
          </span>
        </div>

        {/* Status — inline updatable */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-slate-500 uppercase tracking-widest">Status</span>
          <StatusDropdown taskId={task.id} currentStatus={task.status} />
        </div>

        {/* Description */}
        {task.description && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Description</p>
            <p className="text-sm leading-7 text-slate-300 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        {/* Meta grid */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { label: 'Created by',   value: (task as any).createdBy?.name || '—' },
            { label: 'Assigned to',  value: (task as any).assignedTo?.name || 'Unassigned' },
            { label: 'Due date',     value: task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
            { label: 'Created',      value: new Date(task.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
            { label: 'Last updated', value: task.updatedAt ? new Date(task.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
            { label: 'Priority',     value: priority.label },
          ].map(item => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-widest text-slate-500">{item.label}</p>
              <p className="mt-1.5 text-sm font-medium text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </main>

      {showEdit && (
        <TaskModal
          task={task}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}

export default TaskDetailPage