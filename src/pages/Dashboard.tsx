import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { RequestCard } from '../components/RequestCard'
import { Badge } from '../components/Badge'
import { isEligible, daysUntil } from '../lib/blood'
import { bloodDonationCount, PRIZES } from '../lib/rewards'
import { roleLabel } from '../lib/format'

export function Dashboard() {
  const { currentUser, requests, appointments, facilityOf, notifications, nearbyFacilities, impacts } = useStore()
  if (!currentUser) return null
  const mine = requests.filter((r) => r.posterId === currentUser.id || r.acceptedBy === currentUser.id)
  const open = requests.filter((r) => r.status === 'open' || r.status === 'matched')
  const near = nearbyFacilities().slice(0, 3)
  const latest = notifications.filter((n) => n.userId === currentUser.id).slice(0, 3)
  const upcoming = appointments.filter((a) => a.userId === currentUser.id && a.status === 'booked')

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blood">{roleLabel(currentUser.role)}</p>
      <h1 className="mt-1 font-display text-4xl">Hello, {currentUser.name.split(' ')[0]}.</h1>
      <p className="mt-2 max-w-xl text-muted">
        {currentUser.role === 'donor'
          ? 'Eligible nearby requests, your next donation window, and the lives you already helped — in one place.'
          : 'Post a need, watch live stock, and reach verified donors without starting another WhatsApp group.'}
      </p>

      {currentUser.role === 'donor' && (
        <div className="mt-6 rounded-2xl bg-blood-deep p-5 text-ivory">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm text-ivory/70">Eligibility</div>
              <div className="font-display text-3xl">
                {isEligible(currentUser.nextEligible)
                  ? 'You can donate today'
                  : `${daysUntil(currentUser.nextEligible)} days until you can donate`}
              </div>
              <div className="mt-1 text-sm text-ivory/70">
                Type {currentUser.bloodType ?? 'unknown'} · {currentUser.verified ? 'Verified donor' : 'Verification pending'}
              </div>
            </div>
            <Link to="/app/appointments" className="rounded-full bg-ivory px-4 py-2 text-sm font-semibold text-blood-deep">
              Book a slot
            </Link>
          </div>
          <PrizeLine count={bloodDonationCount(currentUser.id, impacts, requests)} />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">{currentUser.role === 'donor' ? 'Requests you can help' : 'Active requests'}</h2>
            <Link to="/app/requests" className="text-sm text-blood">
              View all
            </Link>
          </div>
          {(currentUser.role === 'donor' ? open : mine.length ? mine : open).slice(0, 4).map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </section>
        <aside className="space-y-6">
          <div className="rounded-2xl bg-paper p-4 ring-1 ring-line">
            <h3 className="font-semibold">Nearest authorised centres</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {near.map(({ facility, km }) => (
                <li key={facility.id} className="flex justify-between gap-2">
                  <span>
                    {facility.name}
                    <div className="text-xs text-muted">{facility.kind.replace('_', ' ')}</div>
                  </span>
                  <Badge tone="muted">{km.toFixed(1)} km</Badge>
                </li>
              ))}
            </ul>
            <Link to="/app/locator" className="mt-3 inline-block text-sm text-blood">
              Open locator
            </Link>
          </div>
          <div className="rounded-2xl bg-paper p-4 ring-1 ring-line">
            <h3 className="font-semibold">Notifications</h3>
            <ul className="mt-3 space-y-3 text-sm">
              {latest.map((n) => (
                <li key={n.id}>
                  <div className="font-medium">{n.title}</div>
                  <p className="text-muted">{n.body}</p>
                </li>
              ))}
            </ul>
          </div>
          {upcoming.length > 0 && (
            <div className="rounded-2xl bg-paper p-4 ring-1 ring-line">
              <h3 className="font-semibold">Upcoming appointments</h3>
              {upcoming.map((a) => (
                <p key={a.id} className="mt-2 text-sm text-muted">
                  {a.kind === 'blood_test' ? 'Free blood test' : 'Donation'} · {a.date} {a.time} · {facilityOf(a.facilityId)?.name}
                </p>
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}

function PrizeLine({ count }: { count: number }) {
  const earned = [...PRIZES].reverse().find((prize) => count >= prize.at)
  const next = PRIZES.find((prize) => prize.at > count)
  return (
    <p className="mt-4 border-t border-ivory/15 pt-4 text-sm text-ivory/80">
      {count} tracked blood donation{count === 1 ? '' : 's'}
      {earned ? ` · ${earned.title} unlocked` : ''}.
      {next ? ` ${next.at - count} more for ${next.title.toLowerCase()}.` : ''}{' '}
      <Link to="/app/support#prizes" className="font-semibold text-ivory underline">
        See prizes
      </Link>
    </p>
  )
}
