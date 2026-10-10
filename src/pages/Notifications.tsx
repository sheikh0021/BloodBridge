import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { formatWhen } from '../lib/format'

export function NotificationsPage() {
  const { notifications, currentUser, markRead, lowInternet } = useStore()
  const mine = notifications.filter((n) => n.userId === currentUser?.id)

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-4xl">Notifications</h1>
      <p className="mt-2 text-sm text-muted">
        Matches, eligibility reminders, impact updates
        {lowInternet ? ' — and SMS copies while Low internet is on.' : '.'}
      </p>
      <ul className="mt-8 space-y-3">
        {mine.map((n) => (
          <li key={n.id} className={`rounded-2xl p-4 ring-1 ring-line ${n.read ? 'bg-paper' : n.kind === 'sms' ? 'bg-ink text-ivory' : 'bg-paper'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wide opacity-70">{n.kind}</div>
                <div className="font-semibold">{n.title}</div>
                <p className={`mt-1 text-sm ${n.kind === 'sms' && !n.read ? 'text-ivory/80' : 'text-muted'}`}>{n.body}</p>
                <p className="mt-2 text-xs opacity-60">{formatWhen(n.createdAt)}</p>
                {n.requestId && (
                  <Link to={`/app/requests/${n.requestId}`} className="mt-2 inline-block text-sm text-blood">
                    Open request
                  </Link>
                )}
              </div>
              {!n.read && (
                <button type="button" className="text-xs" onClick={() => markRead(n.id)}>
                  Mark read
                </button>
              )}
            </div>
          </li>
        ))}
        {mine.length === 0 && <p className="text-sm text-muted">You are caught up.</p>}
      </ul>
    </main>
  )
}
