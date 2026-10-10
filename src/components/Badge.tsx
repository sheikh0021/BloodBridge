import type { ReactNode } from 'react'

export function Badge({
  children,
  tone = 'ink',
}: {
  children: ReactNode
  tone?: 'ink' | 'ok' | 'warn' | 'crit' | 'muted'
}) {
  const map = {
    ink: 'bg-ink text-ivory',
    ok: 'bg-emerald-800 text-emerald-50',
    warn: 'bg-amber/20 text-amber ring-1 ring-amber/40',
    crit: 'bg-blood text-ivory',
    muted: 'bg-line/70 text-ink',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${map[tone]}`}>
      {children}
    </span>
  )
}
