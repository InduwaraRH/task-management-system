import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTasks, useDeleteTask } from '../../services/tasks'
import { Task } from '../../types'
import TaskModal from '../../components/common/TaskModal'
import Button from '../../components/common/Button'

const priorityConfig = {
  LOW: { label: 'Low', className: 'bg-slate-700 text-slate-300' },
  MEDIUM: { label: 'Medium', className: 'bg-amber-900/50 text-amber-300' },
  HIGH: { label: 'High', className: 'bg-red-900/50 text-red-400' },
}

const statusConfig = {
  OPEN: { label: 'Open', className: 'bg-slate-700/90 text-slate-200 ring-1 ring-inset ring-slate-500/30', dot: 'bg-slate-300' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-indigo-500/15 text-indigo-200 ring-1 ring-inset ring-indigo-400/30', dot: 'bg-indigo-300' },
  TESTING: { label: 'Testing', className: 'bg-purple-500/15 text-purple-200 ring-1 ring-inset ring-purple-400/30', dot: 'bg-purple-300' },
  DONE: { label: 'Done', className: 'bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30', dot: 'bg-emerald-300' },
}

const Badge = ({ type, value }: { type: 'priority' | 'status'; value: string }) => {
  const config = type === 'priority'
    ? priorityConfig[value as keyof typeof priorityConfig]
    : statusConfig[value as keyof typeof statusConfig]

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
      {type === 'status' && <span className={`h-1.5 w-1.5 rounded-full ${statusConfig[value as keyof typeof statusConfig].dot}`} />}
      {config.label}
    </span>
  )
}

const priorityOrder = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
} as const

const isOverdue = (dueDate?: string) => {
  if (!dueDate) return false
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  return new Date(dueDate).getTime() < todayStart.getTime()
}

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState('')
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const filters = {
    ...(search && { search }),
    ...(priority && { priority }),
    ...(status && { status }),
  }

  const { data: tasks, isLoading } = useTasks(filters)
  const deleteTask = useDeleteTask()

  const taskList = useMemo(() => {
    return [...(tasks ?? [])].sort((left, right) => {
      const priorityDiff = priorityOrder[left.priority as keyof typeof priorityOrder] - priorityOrder[right.priority as keyof typeof priorityOrder]
      if (priorityDiff !== 0) return priorityDiff
      return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
    })
  }, [tasks])

  const totalTasks = taskList.length
  const activeTasks = taskList.filter((task) => task.status !== 'DONE').length
  const highPriorityTasks = taskList.filter((task) => task.priority === 'HIGH').length
  const dueSoonTasks = taskList.filter((task) => {
    if (!task.dueDate) return false
    const due = new Date(task.dueDate)
    const today = new Date()
    const inSevenDays = new Date()
    inSevenDays.setDate(today.getDate() + 7)
    return due >= today && due <= inSevenDays
  }).length

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return
    await deleteTask.mutateAsync(id)
  }

  return (
    <div className="app-shell text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-bold shadow-lg shadow-indigo-950/30">T</div>
            <div>
              <span className="block text-base font-semibold tracking-tight text-white">TaskFlow</span>
              <span className="block text-xs uppercase tracking-[0.22em] text-slate-500">Focused task workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium text-white">{user?.name}</div>
              <div className="mt-1 inline-flex items-center rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-xs text-slate-300">{user?.role}</div>
            </div>
            <Button variant="ghost" onClick={logout}>Sign out</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <section className="surface-panel rounded-3xl px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-200">
                {user?.role === 'ADMIN' ? 'Team tasks' : 'My tasks'}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">Tasks</h1>
                <span className="text-sm text-slate-400">{user?.role === 'ADMIN' ? 'Review the team queue and keep priorities visible.' : 'Focus on your assigned work and keep progress moving.'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Total', value: totalTasks },
                { label: 'Active', value: activeTasks },
                { label: 'High', value: highPriorityTasks },
                { label: 'Due soon', value: dueSoonTasks },
              ].map((item) => (
                <div key={item.label} className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 text-xs text-slate-300">
                  <span className="font-medium text-white">{item.value}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <Button onClick={() => { setEditingTask(null); setShowModal(true) }}>
              + New Task
            </Button>
          </div>
        </section>

        <section className="surface-panel mt-4 rounded-3xl px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <input
                type="text"
                placeholder="Search tasks"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-base-sm h-9 w-full rounded-xl px-3 py-2 md:w-72 lg:w-80"
              />
              <div className="flex gap-3 md:ml-auto">
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input-base-sm h-9 rounded-xl px-3 py-2 md:w-40">
                  <option value="">All priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-base-sm h-9 rounded-xl px-3 py-2 md:w-44">
                  <option value="">All statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="TESTING">Testing</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>

            {(search || priority || status) && (
              <button
                type="button"
                onClick={() => { setSearch(''); setPriority(''); setStatus('') }}
                aria-label="Clear filters"
                title="Clear filters"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-slate-300 transition hover:bg-white/[0.12] hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </section>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          </div>
        ) : !taskList.length ? (
          <div className="surface-panel mt-4 rounded-3xl px-6 py-16 text-center text-slate-400">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl text-cyan-300">⌁</div>
            <p className="text-lg font-medium text-white">No tasks found</p>
            <p className="mt-1 text-sm text-slate-400">{search || priority || status ? 'Try adjusting your filters.' : 'Create your first task to get started.'}</p>
            <div className="mt-6">
              <Button onClick={() => { setEditingTask(null); setShowModal(true) }}>
                Create your first task
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="surface-panel overflow-hidden rounded-3xl">
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead className="bg-white/[0.03]">
                    <tr className="border-b border-white/10">
                      <th className="px-5 py-3 min-w-[120px] text-left text-xs font-medium uppercase tracking-[0.24em] text-slate-400">Task</th>
                      <th className="px-5 py-3 min-w-[120px] text-left text-xs font-medium uppercase tracking-[0.24em] text-slate-400">Priority</th>
                      <th className="px-5 py-3 min-w-[120px] text-left text-xs font-medium uppercase tracking-[0.24em] text-slate-400">Status</th>
                      <th className="px-5 py-3 min-w-[120px] text-left text-xs font-medium uppercase tracking-[0.24em] text-slate-400">Assignee</th>
                      <th className="px-5 py-3 min-w-[120px] text-left text-xs font-medium uppercase tracking-[0.24em] text-slate-400">Due</th>
                      <th className="px-5 py-3 min-w-[120px]" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {taskList.map((task) => {
                      const overdue = isOverdue(task.dueDate)
                      return (
                        <tr key={task.id} className={`group transition-colors hover:bg-white/5 ${task.priority === 'HIGH' ? 'bg-rose-500/[0.04]' : ''}`}>
                          <td className="px-5 py-4 align-top">
                            <div className="max-w-xs">
                              <div className="flex items-center gap-2">
                                {task.priority === 'HIGH' && <span className="h-2 w-2 rounded-full bg-rose-400" />}
                                <div className="font-medium text-white">{task.title}</div>
                              </div>
                              {task.description && <div className="mt-1 max-w-2xl truncate text-sm text-slate-400">{task.description}</div>}
                            </div>
                          </td>
                          <td className="px-5 py-4"><Badge type="priority" value={task.priority} /></td>
                          <td className="px-5 py-4"><Badge type="status" value={task.status} /></td>
                          <td className="px-5 py-4 text-sm text-slate-300">{(task as any).assignedTo?.name || 'Unassigned'}</td>
                          <td className={`px-5 py-4 text-sm ${overdue ? 'text-rose-300' : 'text-slate-300'}`}>
                            <div className="flex items-center gap-2">
                              <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</span>
                              {overdue && <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-200">Overdue</span>}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" onClick={() => { setEditingTask(task); setShowModal(true) }} className="h-8 px-3 py-1 text-xs">
                                Edit
                              </Button>
                              <Button variant="danger" onClick={() => handleDelete(task.id)} className="h-8 px-3 py-1 text-xs">
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 p-4 lg:hidden">
                {taskList.map((task) => {
                  const overdue = isOverdue(task.dueDate)
                  return (
                    <article key={task.id} className={`rounded-3xl border border-white/10 bg-white/5 p-4 ${task.priority === 'HIGH' ? 'bg-rose-500/[0.04]' : ''}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="flex items-center gap-2 font-medium text-white">
                            {task.priority === 'HIGH' && <span className="h-2 w-2 rounded-full bg-rose-400" />}
                            {task.title}
                          </h3>
                          {task.description && <p className="mt-2 text-sm leading-6 text-slate-400">{task.description}</p>}
                        </div>
                        <Badge type="priority" value={task.priority} />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge type="status" value={task.status} />
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{(task as any).assignedTo?.name || 'Unassigned'}</span>
                        {task.dueDate ? (
                          <span className={`rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs ${overdue ? 'text-rose-200' : 'text-slate-300'}`}>
                            {new Date(task.dueDate).toLocaleDateString()}{overdue ? ' • Overdue' : ''}
                          </span>
                        ) : (
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">No due date</span>
                        )}
                      </div>

                      <div className="mt-4 flex gap-3">
                        <Button variant="ghost" onClick={() => { setEditingTask(task); setShowModal(true) }} className="h-9 flex-1 px-3 py-2 text-xs">
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(task.id)} className="h-9 flex-1 px-3 py-2 text-xs">
                          Delete
                        </Button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => { setShowModal(false); setEditingTask(null) }}
        />
      )}
    </div>
  )
}

export default DashboardPage