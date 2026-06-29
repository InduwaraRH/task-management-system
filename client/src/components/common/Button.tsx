import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  variant?: 'primary' | 'ghost' | 'danger'
}

const variantClasses = {
  primary: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20',
  ghost: 'bg-white/5 text-slate-100 hover:bg-white/10 border border-white/10',
  danger: 'bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/20',
}

const Button: React.FC<Props> = ({ children, loading, variant = 'primary', className = '', ...rest }) => (
  <button
    {...rest}
    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    disabled={rest.disabled || loading}
  >
    {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
    {loading ? 'Loading...' : children}
  </button>
)

export default Button
