import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RequestCard } from '../components/RequestCard'
import { useStore } from '../store'
import { BLOOD_TYPES, type BloodType, type RequestStatus } from '../types'

export function Requests() {
  const { requests } = useStore()
  const [type, setType] = useState<BloodType | 'all'>('all')
  const [status, setStatus] = useState<RequestStatus | 'all'>('all')

  const list = useMemo(
    () =>
      requests.filter((r) => (type === 'all' || r.bloodType === type) && (status === 'all' || r.status === status)),
    [requests, type, status],
  )

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Blood requests</h1>
          <p className="mt-1 text-sm text-muted">Verified hospital, NGO and family requests. Fake-group noise stays out.</p>
        </div>
        <Link to="/app/request" className="rounded-full bg-blood px-4 py-2 text-sm font-semibold text-ivory">
          Post request
        </Link>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <select className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm" value={type} onChange={(e) => setType(e.target.value as BloodType | 'all')}>
          <option value="all">All types</option>
          {BLOOD_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm" value={status} onChange={(e) => setStatus(e.target.value as RequestStatus | 'all')}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="matched">Matched</option>
          <option value="fulfilled">Fulfilled</option>
        </select>
      </div>
      <div className="mt-6 space-y-3">
        {list.map((r) => (
          <RequestCard key={r.id} request={r} />
        ))}
        {list.length === 0 && <p className="text-sm text-muted">No requests for this filter.</p>}
      </div>
    </main>
  )
}
