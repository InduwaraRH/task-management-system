import { ReactNode } from 'react'

type Props = {
  title: string
  subtitle: string
  badge: string
  highlights: string[]
  children: ReactNode
  footer: ReactNode
}

const AuthFrame = ({ title, subtitle, badge, highlights, children, footer }: Props) => {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.14),_transparent_28%)]" />
      <div className="absolute left-8 top-16 -z-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute right-12 bottom-10 -z-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="surface-panel hidden h-full rounded-3xl p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-cyan-200">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              {badge}
            </div>
            <h1 className="mt-8 max-w-lg text-5xl font-semibold leading-tight tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">{subtitle}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {highlights.map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">0{index + 1}</div>
                <p className="mt-3 text-sm font-medium text-slate-100">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-lg">
          <div className="surface-panel rounded-3xl p-6 sm:p-8">{children}</div>
          <div className="mt-5 text-center text-sm text-slate-400">{footer}</div>
        </section>
      </div>
    </div>
  )
}

export default AuthFrame