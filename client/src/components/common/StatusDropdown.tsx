import { useState, useRef, useEffect } from 'react'
import { useUpdateTask } from '../../services/tasks'

const statusOptions = [
  { value: 'OPEN',        label: 'Open',        className: 'bg-slate-700/90 text-slate-200 ring-1 ring-inset ring-slate-500/30',     dot: 'bg-slate-300' },
  { value: 'IN_PROGRESS', label: 'In Progress', className: 'bg-indigo-500/15 text-indigo-200 ring-1 ring-inset ring-indigo-400/30',  dot: 'bg-indigo-300' },
  { value: 'TESTING',     label: 'Testing',     className: 'bg-purple-500/15 text-purple-200 ring-1 ring-inset ring-purple-400/30',  dot: 'bg-purple-300' },
  { value: 'DONE',        label: 'Done',        className: 'bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30', dot: 'bg-emerald-300' },
]

interface Props {
  taskId: string
  currentStatus: string
}

const StatusDropdown = ({ taskId, currentStatus }: Props) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const updateTask = useUpdateTask()

  const current = statusOptions.find(s => s.value === currentStatus) || statusOptions[0]

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = async (value: string) => {
    if (value === currentStatus) { setOpen(false); return }
    setOpen(false)
    await updateTask.mutateAsync({ id: taskId, data: { status: value as any } })
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${current.className}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
        {current.label}
        <span className="ml-0.5 text-[10px] opacity-60">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-36 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-xl">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/5 ${option.value === currentStatus ? 'opacity-50 cursor-default' : ''}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${option.dot}`} />
              <span className="text-slate-200">{option.label}</span>
              {option.value === currentStatus && <span className="ml-auto text-[10px] text-slate-500">current</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default StatusDropdown