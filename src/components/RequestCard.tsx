import { Link } from 'react-router-dom'
import type { BloodRequest } from '../types'
import { Badge } from './Badge'
import { formatWhen, urgencyLabel } from '../lib/format'
import { useStore } from '../store'

export function RequestCard({ request }: { request: BloodRequest }) {
  const { facilityOf } = useStore()
  const fac = facilityOf(request.facilityId)
  return (
    <Link
      to={`/app/requests/${request.id}`}
      className="block rounded-2xl bg-paper p-4 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl text-blood">{request.bloodType}</span>
            <Badge tone={request.urgency === 'critical' ? 'crit' : request.urgency === 'urgent' ? 'warn' : 'muted'}>
              {urgencyLabel(request.urgency)}
            </Badge>
            {request.verified && <Badge tone="ok">Verified</Badge>}
          </div>
          <div className="mt-1 font-semibold">{request.patientName}</div>
          <div className="text-sm text-muted">
            {request.units} unit(s) · {fac?.name} · {request.city}
          </div>
        </div>
        <div className="text-right text-xs text-muted">
          <div className="capitalize">{request.status}</div>
          <div>{formatWhen(request.createdAt)}</div>
        </div>
      </div>
    </Link>
  )
}
