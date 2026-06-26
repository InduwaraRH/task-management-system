import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

const Button: React.FC<Props> = ({ children, loading, ...rest }) => (
  <button
    {...rest}
    className={`px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 ${rest.className || ''}`}
    disabled={rest.disabled || loading}
  >
    {loading ? 'Loading...' : children}
  </button>
)

export default Button
