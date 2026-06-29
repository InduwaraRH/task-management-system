import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTasks, useDeleteTask } from '../../services/tasks'
import { Task } from '../../types'
import TaskModal from '../../components/common/TaskModal'

const priorityConfig = {
  LOW:    { label: 'Low',    className: 'bg-slate-700 text-slate-300' },
  MEDIUM: { label: 'Medium', className: 'bg-amber-900/50 text-amber-300' },
  HIGH:   { label: 'High',   className: 'bg-red-900/50 text-red-400' },
}

const statusConfig = {
  OPEN:        { label: 'Open',        className: 'bg-slate-700 text-slate-300' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-indigo-900/50 text-indigo-300' },
  TESTING:     { label: 'Testing',     className: 'bg-purple-900/50 text-purple-300' },
  DONE:        { label: 'Done',        className: 'bg-emerald-900/50 text-emerald-400' },
}

const Badge = ({ type, value }: { type: 'priority' | 'status'; value: string }) => {
  const config = type === 'priority'
    ? priorityConfig[value as keyof typeof priorityConfig]
    : statusConfig[value as keyof typeof statusConfig]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return
    await deleteTask.mutateAsync(id)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold">T</div>
          <span className="font-semibold text-white">TaskFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {user?.name}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${user?.role === 'ADMIN' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-gray-800 text-gray-400'}`}>
              {user?.role}
            </span>
          </span>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page title + create button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Tasks</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {user?.role === 'ADMIN' ? 'All tasks across the team' : 'Your assigned and created tasks'}
            </p>
          </div>
          <button
            onClick={() => { setEditingTask(null); setShowModal(true) }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + New Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="TESTING">Testing</option>
            <option value="DONE">Done</option>
          </select>
          {(search || priority || status) && (
            <button
              onClick={() => { setSearch(''); setPriority(''); setStatus('') }}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Task list */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !tasks?.length ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No tasks found</p>
            <p className="text-sm mt-1">
              {search || priority || status ? 'Try adjusting your filters' : 'Create your first task to get started'}
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Assignee</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Due</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm text-white">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{task.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge type="priority" value={task.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge type="status" value={task.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {(task as any).assignedTo?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => { setEditingTask(task); setShowModal(true) }}
                          className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-900/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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