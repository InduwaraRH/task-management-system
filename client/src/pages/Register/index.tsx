import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthFrame from '../../components/common/AuthFrame'
import Button from '../../components/common/Button'

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password, role)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthFrame
      badge="Team onboarding"
      title="Bring the whole workspace into one rhythm."
      subtitle="Create an account to assign tasks, track progress, and keep everyone working from a single source of truth."
      highlights={['Role-based access', 'Fast updates', 'Team visibility']}
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">Sign in</Link></>}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Create account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Set up your workspace in a few quick steps.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-base">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-base"
            placeholder="Hashen Ranathunga"
          />
        </div>

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
            placeholder="Min. 6 characters"
          />
        </div>

        <div>
          <label className="label-base">Account type</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input-base">
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {error && <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>
    </AuthFrame>
  )
}

export default RegisterPage