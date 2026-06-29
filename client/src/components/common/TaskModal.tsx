import { useEffect, useState } from 'react'
import { Task } from '../../types'
import { useCreateTask, useUpdateTask, useUsers } from '../../services/tasks'
import Button from './Button'

interface Props {
  task?: Task | null
  onClose: () => void
}

const TaskModal = ({ task, onClose }: Props) => {
  const isEditing = !!task
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const { data: users } = useUsers()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [status, setStatus] = useState('OPEN')
  const [dueDate, setDueDate] = useState('')
  const [assignedToId, setAssignedToId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setStatus(task.status)
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '')
      setAssignedToId((task as any).assignedTo?.id || '')
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const payload = {
      title,
      description: description || undefined,
      priority: priority as Task['priority'],
      status: status as Task['status'],
      dueDate: dueDate || undefined,
      assignedToId: assignedToId || null,
    }
    try {
      if (isEditing) {
        await updateTask.mutateAsync({ id: task.id, data: payload })
      } else {
        await createTask.mutateAsync(payload)
      }
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
  }

  const isSubmitting = createTask.isPending || updateTask.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="surface-panel w-full max-w-2xl overflow-hidden rounded-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">Task editor</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{isEditing ? 'Edit task' : 'Create a task'}</h2>
            <p className="mt-1 text-sm text-slate-400">Capture the work once, then assign and track it clearly.</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-2xl leading-none text-slate-300 hover:bg-white/10 hover:text-white">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <label className="label-base">Title <span className="text-rose-400">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-base"
              placeholder="Task title"
            />
          </div>

          <div>
            <label className="label-base">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="input-base resize-none"
              placeholder="Optional description"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label-base">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="input-base"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="label-base">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-base"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="TESTING">Testing</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label-base">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-base"
              />
            </div>
            <div>
              <label className="label-base">Assign to</label>
              <select
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                className="input-base"
              >
                <option value="">Unassigned</option>
                {users?.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Create task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal