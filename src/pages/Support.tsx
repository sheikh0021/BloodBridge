import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PRIZES, bloodDonationCount } from '../lib/rewards'
import { useStore } from '../store'

const amounts = [200, 500, 1000, 2500]

export function Support() {
  const { currentUser, gifts, giveMoney, impacts, requests, users } = useStore()
  const [amount, setAmount] = useState(500)
  const [custom, setCustom] = useState('')
  const [name, setName] = useState(currentUser?.name ?? '')
  const [thanks, setThanks] = useState<number | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const raised = (gifts ?? []).reduce((sum, gift) => sum + gift.amount, 0)
  const mine = currentUser?.role === 'donor' ? bloodDonationCount(currentUser.id, impacts, requests) : 0
  const regulars = users
    .filter((user) => user.role === 'donor')
    .map((user) => ({ user, count: bloodDonationCount(user.id, impacts, requests) }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const rupees = custom.trim() ? Number(custom) : amount
    const message = giveMoney(rupees, name)
    if (message) {
      setErr(message)
      setThanks(null)
      return
    }
    setErr(null)
    setThanks(rupees)
    setCustom('')
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blood">Support the organisation</p>
      <h1 className="mt-2 font-display text-4xl">Help the bridge stay open.</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Blood donation is always free. A money gift pays for camps, SMS alerts and the matching desk. Regular blood
        donors earn a prize as they come back.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="rounded-3xl bg-paper p-6 ring-1 ring-line">
          <h2 className="font-display text-2xl">Donate money</h2>
          <p className="mt-1 text-sm text-muted">Sample checkout. Nothing is charged to a real card.</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {amounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setAmount(value)
                  setCustom('')
                }}
                className={`rounded-2xl px-3 py-3 text-sm font-semibold ring-1 ${
                  !custom && amount === value ? 'bg-blood text-ivory ring-blood' : 'bg-ivory ring-line'
                }`}
              >
                ₹{value.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          <label className="mt-4 block text-sm">
            Other amount
            <input
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border border-line bg-ivory px-3 py-2"
              placeholder="₹"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ''))}
            />
          </label>
          <label className="mt-4 block text-sm">
            Name on the gift
            <input
              className="mt-1 w-full rounded-xl border border-line bg-ivory px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>
          {err && <p className="mt-3 text-sm text-blood">{err}</p>}
          {thanks !== null && (
            <p className="mt-3 text-sm text-emerald-800">
              Recorded ₹{thanks.toLocaleString('en-IN')}. Thank you — this stays inside the prototype.
            </p>
          )}
          <button className="mt-5 rounded-full bg-blood px-5 py-2.5 text-sm font-semibold text-ivory">
            Give ₹{(custom.trim() ? Number(custom) : amount).toLocaleString('en-IN')}
          </button>
        </form>

        <aside className="rounded-3xl bg-blood-deep p-6 text-ivory">
          <p className="text-sm text-ivory/70">Raised in this prototype</p>
          <p className="mt-2 font-display text-5xl">₹{raised.toLocaleString('en-IN')}</p>
          <ul className="mt-6 space-y-3 text-sm">
            {(gifts ?? []).slice(0, 4).map((gift) => (
              <li key={gift.id} className="flex justify-between gap-3 border-t border-ivory/15 pt-3">
                <span>{gift.name}</span>
                <span>₹{gift.amount.toLocaleString('en-IN')}</span>
              </li>
            ))}
            {(gifts ?? []).length === 0 && <li className="text-ivory/70">No gifts yet. Yours can be the first.</li>}
          </ul>
        </aside>
      </div>

      <section id="prizes" className="mt-14">
        <h2 className="font-display text-3xl">Prizes for regular donors</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Each tracked blood donation moves you up. Money gifts do not count toward these prizes — only coming back to
          give blood does.
        </p>
        {currentUser?.role === 'donor' && (
          <p className="mt-4 text-sm">
            You have <span className="font-semibold">{mine}</span> tracked donation{mine === 1 ? '' : 's'}.
            {mine < 8 ? ` ${nextGap(mine)} more to the next prize.` : ' Every prize on this board is yours.'}
          </p>
        )}
        {currentUser && currentUser.role !== 'donor' && (
          <p className="mt-4 text-sm text-muted">
            Prizes are for blood donors.{' '}
            <Link to="/register" className="font-semibold text-blood">
              Join as a donor
            </Link>{' '}
            to start a streak.
          </p>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PRIZES.map((prize) => {
            const unlocked = currentUser?.role === 'donor' && mine >= prize.at
            return (
              <article key={prize.at} className={`rounded-2xl p-5 ring-1 ring-line ${unlocked ? 'bg-paper' : 'bg-ivory'}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blood">
                  {prize.at} donation{prize.at === 1 ? '' : 's'}
                  {unlocked ? ' · unlocked' : ''}
                </p>
                <h3 className="mt-2 font-display text-2xl">{prize.title}</h3>
                <p className="mt-2 text-sm text-muted">{prize.detail}</p>
              </article>
            )
          })}
        </div>

        <h3 className="mt-10 font-display text-2xl">Donors already on the board</h3>
        <ul className="mt-4 divide-y divide-line rounded-2xl bg-paper ring-1 ring-line">
          {regulars.map(({ user, count }) => (
            <li key={user.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="font-semibold">{user.name}</span>
              <span className="text-muted">
                {count} donation{count === 1 ? '' : 's'} · {prizeName(count)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

function nextGap(count: number) {
  const next = PRIZES.find((prize) => prize.at > count)
  if (!next) return 0
  return next.at - count
}

function prizeName(count: number) {
  const earned = [...PRIZES].reverse().find((prize) => count >= prize.at)
  return earned ? earned.title : 'Getting started'
}
