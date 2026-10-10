import { useStore } from '../store'
import { BLOOD_TYPES } from '../types'
import { formatWhen } from '../lib/format'
import { Navigate } from 'react-router-dom'

export function Stock() {
  const { currentUser, stocks, facilities, updateStock } = useStore()
  if (!currentUser || (currentUser.role !== 'hospital' && currentUser.role !== 'blood_bank' && currentUser.role !== 'ngo')) {
    return <Navigate to="/app" replace />
  }

  const mine = facilities.filter((f) => f.name === currentUser.orgName || f.kind === currentUser.role || (currentUser.role === 'ngo' && f.kind === 'ngo'))
  const rows = stocks.filter((s) => mine.some((f) => f.id === s.facilityId) || mine.length === 0)

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl">Live stock dashboard</h1>
      <p className="mt-2 text-sm text-muted">
        Blood banks and hospitals post current units so families are not sent to an empty shelf. This is the layer
        e-RaktKosh often leaves stale, and WhatsApp never had.
      </p>
      <div className="mt-8 space-y-8">
        {rows.map((row) => {
          const fac = facilities.find((f) => f.id === row.facilityId)
          return (
            <section key={row.facilityId} className="rounded-2xl bg-paper p-5 ring-1 ring-line">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-2xl">{fac?.name}</h2>
                <span className="text-xs text-muted">Updated {formatWhen(row.updatedAt)}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {BLOOD_TYPES.map((t) => (
                  <label key={t} className="rounded-xl bg-ivory p-3 ring-1 ring-line">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-blood">{t}</span>
                      <span className={row.units[t] === 0 ? 'text-blood' : 'text-muted'}>{row.units[t] === 0 ? 'Empty' : 'units'}</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      className="mt-2 w-full bg-transparent text-2xl font-display outline-none"
                      value={row.units[t]}
                      onChange={(e) => updateStock(row.facilityId, t, Number(e.target.value))}
                    />
                  </label>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
