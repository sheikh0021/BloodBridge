import { Link } from 'react-router-dom'

export function HowItWorks() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blood">Prototype flow</p>
      <h1 className="mt-2 font-display text-5xl">Request. Match. Notify. Accept. Track.</h1>
      <p className="mt-4 text-muted">
        BloodBridge is built so a family or a hospital can post a need in under a minute, and a verified nearby donor
        can answer without leaking phone numbers too early.
      </p>
      <ol className="mt-10 space-y-6">
        {[
          ['Request', 'Patient, hospital, blood bank or NGO files blood type, units, urgency and the authorised facility.'],
          ['Match', 'The platform keeps only eligible, verified donors whose type can fill the request and who are nearby.'],
          ['Notify', 'Push-style in-app alerts by default. Toggle Low internet to see the SMS fallback copy go out instead.'],
          ['Accept', 'The donor taps accept. Only then are both numbers visible. Until then, phones stay masked.'],
          ['Donate and track', 'The hospital marks the unit used. The donor sees impact, and the next 12-week eligible date.'],
        ].map(([t, d], i) => (
          <li key={t} className="grid grid-cols-[auto_1fr] gap-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-blood font-display text-ivory">{i + 1}</div>
            <div>
              <div className="font-semibold">{t}</div>
              <p className="text-sm text-muted">{d}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-10 rounded-2xl bg-paper p-5 ring-1 ring-line text-sm">
        Proposed stack from the brief: Flutter app · Node/Python backend · PostgreSQL · Maps API · SMS gateway. This
        web prototype stands in for those pieces so judges can click the whole loop.
      </div>
      <Link to="/register" className="mt-8 inline-block rounded-full bg-blood px-5 py-2.5 text-sm font-semibold text-ivory">
        Try a demo role
      </Link>
    </main>
  )
}
