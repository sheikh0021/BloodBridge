import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from '../store'
import { Badge } from '../components/Badge'
import { MapView } from '../components/MapView'
import { formatWhen, maskPhone, roleLabel, urgencyLabel } from '../lib/format'
import { formatKm } from '../lib/geo'

export function RequestDetail() {
  const { id } = useParams()
  const { requests, facilityOf, userById, currentUser, matchesFor, acceptRequest, reachOut, fulfillRequest, lowInternet } = useStore()
  const [connected, setConnected] = useState<Record<string, string>>({})
  const request = requests.find((r) => r.id === id)
  if (!request) return <main className="mx-auto max-w-3xl px-4 py-10">Request not found.</main>

  const fac = facilityOf(request.facilityId)
  const poster = userById(request.posterId)
  const acceptor = request.acceptedBy ? userById(request.acceptedBy) : undefined
  const matches = matchesFor(request)
  const canAccept = currentUser?.role === 'donor'
  const canFulfill =
    currentUser &&
    (currentUser.id === request.posterId || currentUser.role === 'hospital' || currentUser.role === 'blood_bank') &&
    request.status === 'matched'
  const showPhones = Boolean(request.phoneShared)
  const canConnect = Boolean(currentUser && currentUser.role !== 'donor')

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-5xl text-blood">{request.bloodType}</span>
            <Badge tone={request.urgency === 'critical' ? 'crit' : 'warn'}>{urgencyLabel(request.urgency)}</Badge>
            {request.verified && <Badge tone="ok">Verified request</Badge>}
            <Badge tone="muted">{request.status}</Badge>
          </div>
          <h1 className="mt-2 font-display text-3xl">{request.patientName}</h1>
          <p className="text-muted">
            {request.units} unit(s) · {fac?.name} · {request.city} · {formatWhen(request.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          {canAccept && request.status === 'open' && (
            <button
              type="button"
              onClick={() => {
                const err = acceptRequest(request.id)
                if (err) alert(err)
              }}
              className="rounded-full bg-blood px-4 py-2 text-sm font-semibold text-ivory"
            >
              Accept match
            </button>
          )}
          {canFulfill && (
            <button type="button" onClick={() => fulfillRequest(request.id)} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-ivory">
              Mark donated
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-sm">{request.notes}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="h-72">
          {fac && (
            <MapView
              center={fac}
              markers={[
                { id: 'fac', lat: fac.lat, lng: fac.lng, label: fac.name, tone: 'alert' },
                ...(currentUser ? [{ id: 'you', lat: currentUser.lat, lng: currentUser.lng, label: 'You', tone: 'you' as const }] : []),
              ]}
            />
          )}
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-paper p-4 ring-1 ring-line">
            <h2 className="font-semibold">Privacy</h2>
            <p className="mt-1 text-sm text-muted">
              Phone numbers stay masked until a donor accepts. When a blood-type match is listed below, use Connect to
              reach that donor by email.
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted">Posted by</dt>
                <dd>
                  {poster?.name} · {poster ? roleLabel(poster.role) : ''}
                </dd>
                <dd className="font-mono">{showPhones ? poster?.phone : maskPhone(poster?.phone ?? '')}</dd>
              </div>
              <div>
                <dt className="text-muted">Accepted donor</dt>
                <dd>{acceptor?.name ?? 'Waiting'}</dd>
                <dd className="font-mono">{acceptor ? (showPhones ? acceptor.phone : maskPhone(acceptor.phone)) : '—'}</dd>
              </div>
            </dl>
          </div>
          {lowInternet && (
            <div className="rounded-2xl bg-ink p-4 text-sm text-ivory">
              SMS fallback is on. Matching donors received:{' '}
              <span className="font-mono">BloodBridge: {request.units}u {request.bloodType} at {fac?.name}. Reply ACCEPT</span>
            </div>
          )}
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Eligible nearby donors</h2>
        <p className="text-sm text-muted">Verified + right type + past the 10–12 week gap.</p>
        <ul className="mt-4 divide-y divide-line rounded-2xl bg-paper ring-1 ring-line">
          {matches.map(({ donor, km }) => (
            <li key={donor.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
              <div>
                <div className="font-semibold">
                  {donor.name} · {donor.bloodType}
                </div>
                <div className="text-muted">{donor.city} · {donor.verified ? 'Verified' : 'Unverified'}</div>
                {connected[donor.id] && (
                  <a href={`mailto:${connected[donor.id]}`} className="mt-1 block font-medium text-blood">
                    {connected[donor.id]}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div>{formatKm(km)}</div>
                  <div className="font-mono text-xs text-muted">{showPhones && donor.id === request.acceptedBy ? donor.phone : maskPhone(donor.phone)}</div>
                </div>
                {canConnect && !connected[donor.id] && (
                  <button
                    type="button"
                    onClick={() => {
                      const err = reachOut(request.id, donor.id)
                      if (err) alert(err)
                      else setConnected((prev) => ({ ...prev, [donor.id]: donor.email }))
                    }}
                    className="rounded-full bg-blood px-3 py-1.5 text-xs font-semibold text-ivory"
                  >
                    Connect
                  </button>
                )}
              </div>
            </li>
          ))}
          {matches.length === 0 && <li className="px-4 py-6 text-sm text-muted">No eligible donors in range yet.</li>}
        </ul>
      </section>
    </main>
  )
}
