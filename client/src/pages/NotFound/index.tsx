import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="surface-panel max-w-md rounded-3xl px-8 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl text-cyan-300">404</div>
      <h1 className="mt-6 text-3xl font-semibold text-white">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-slate-400">The page you requested does not exist or was moved.</p>
      <Link to="/dashboard" className="mt-6 inline-flex rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
        Return to dashboard
      </Link>
    </div>
  </div>
)

export default NotFoundPage
