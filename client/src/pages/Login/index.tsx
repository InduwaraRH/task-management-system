import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthFrame from '../../components/common/AuthFrame'
import Button from '../../components/common/Button'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthFrame
      badge="TaskFlow workspace"
      title="Keep work moving without the clutter."
      subtitle="Sign in to review assignments, update status, and keep the team aligned from one focused dashboard."
      highlights={['Clear ownership', 'Fast filters', 'Simple admin flow']}
      footer={<>Don't have an account? <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">Create one</Link></>}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Sign in to continue managing your tasks.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-base">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-base"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="label-base">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-base"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

        <Button type="submit" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>
    </AuthFrame>
  )
}

export default LoginPage