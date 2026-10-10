import { ArrowRight, Check, Hospital, MessageCircle, ShieldCheck, Smartphone } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const steps = [
  { n: '1', t: 'Request', d: 'Patient or hospital posts a request in under a minute.' },
  { n: '2', t: 'Match', d: 'Eligible, verified donors nearby are found by type and location.' },
  { n: '3', t: 'Notify', d: 'Donors get an alert, with SMS fallback on a weak connection.' },
  { n: '4', t: 'Accept', d: 'Donor accepts. Phone number is shared only now.' },
  { n: '5', t: 'Donate & track', d: 'Donation is tracked. Next eligible date (10–12 weeks) is shown.' },
]

const features = [
  { t: 'Hospital / clinic locator', d: 'With permission, see the nearest authorised centre open for donation.' },
  { t: 'Transparency and trust', d: 'Get notified how your donation was used and the life it helped.' },
  { t: 'Awareness', d: 'News and flashcards that bust myths about blood donation.' },
  { t: 'Appointment scheduler', d: 'Book a donation or a free blood-type test from your phone.' },
  { t: 'Timely notifications', d: 'Reminders when you are eligible again — every 10–12 weeks.' },
  { t: 'Accountability', d: 'Hospitals and clinics are govt-approved. Documents are checked first.' },
]

export function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-blood-deep text-ivory">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blood/60 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="rise">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber">A life-saving platform</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] md:text-6xl">
              One platform.
              <br />
              Every donor.
              <br />
              Faster help.
            </h1>
            <p className="mt-5 max-w-md text-lg text-ivory/80">
              We don&apos;t create another network. We connect the networks that already exist — hospitals, NGOs, blood
              banks and donors.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="rounded-full bg-ivory px-5 py-2.5 text-sm font-semibold text-blood-deep">
                Join BloodBridge
              </Link>
              <Link to="/how-it-works" className="rounded-full border border-ivory/30 px-5 py-2.5 text-sm">
                See the flow
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
              <Stat n="1.9M" l="units short in India, 2016–17" />
              <Stat n="84%" l="Bihar shortfall vs Chandigarh surplus" />
              <Stat n="4" l="networks on one match board" />
            </div>
          </div>
          <div className="rise rounded-3xl bg-ivory/5 p-6 ring-1 ring-ivory/15">
            <p className="text-sm text-ivory/70">Live prototype snapshot</p>
            <div className="mt-4 space-y-3">
              <Pulse row="AIIMS · O+ · 2 units" tag="Critical" />
              <Pulse row="Safdarjung · B+ · 1 unit" tag="Urgent" />
              <Pulse row="PMCH Patna · O- · 3 units" tag="Critical" />
            </div>
            <p className="mt-5 text-xs text-ivory/50">Verified hospital and NGO requests. Numbers hidden until accept.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blood">The problem</p>
        <h2 className="mt-2 max-w-2xl font-display text-4xl">Right donor, right time is still a struggle.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card title="Right donor, right time" body="When a patient needs blood, finding the right donor at the right time is still a struggle." />
          <Card title="Separate channels" body="Donors, NGOs, hospitals and blood banks work through separate channels, so there is no single place to look." />
          <Card title="Delays for families" body="Patients and families cannot easily find available, verified blood donors on time." />
        </div>
        <p className="mt-6 text-xs text-muted">
          Sources: The Quint, India&apos;s blood shortage (Health Ministry data, 2016–17); ISignal / IndiaSpend (Health Ministry data, 2015–16).
        </p>
      </section>

      <section className="bg-paper py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blood">Who is affected</p>
            <h2 className="mt-2 font-display text-4xl">Every delay puts a life at risk.</h2>
            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <span className="font-semibold">Patients.</span> Every delay in getting blood puts their life at risk.
              </li>
              <li>
                <span className="font-semibold">Families.</span> They search across apps, calls and groups, and cannot tell who is available, eligible and genuine.
              </li>
              <li>
                <span className="font-semibold">Donors, hospitals, blood banks and NGOs.</span> They want to help, but their efforts stay scattered and are hard to connect.
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blood">What is needed</p>
            <h2 className="mt-2 font-display text-4xl">One trusted place, not another network.</h2>
            <ul className="mt-6 space-y-4 text-sm">
              <li>One platform that brings all blood sources together.</li>
              <li>Verified donors and organisations, so the help is safe and genuine.</li>
              <li>Quick matching and clear tracking, so blood reaches the patient faster.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blood">Our solution</p>
        <h2 className="mt-2 max-w-2xl font-display text-4xl">One platform. Every donor. Faster help.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card title="1 · Spread awareness" body="Learn why donating blood matters and how it saves lives — myths, news and flashcards." />
          <Card title="2 · Free blood test" body="Book a free test so people know their blood type and which patients they can help." />
          <Card title="3 · Transparent communication" body="Users are notified about the person they directly or indirectly helped." />
          <Card title="4 · Match and donate" body="People in need find a match, and interested, eligible donors can donate." />
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blood">How it works</p>
          <h2 className="mt-2 font-display text-4xl">Five steps from request to tracked donation.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-line p-4">
                <div className="font-display text-3xl text-blood">{s.n}</div>
                <div className="mt-2 font-semibold">{s.t}</div>
                <p className="mt-1 text-sm text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blood">Why we&apos;re different</p>
        <h2 className="mt-2 font-display text-4xl">We connect e-RaktKosh, hospitals and informal groups.</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl ring-1 ring-line">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-blood-deep text-ivory">
              <tr>
                <th className="px-4 py-3 font-medium"> </th>
                <th className="px-4 py-3 font-medium">e-RaktKosh</th>
                <th className="px-4 py-3 font-medium">WhatsApp groups</th>
                <th className="px-4 py-3 font-medium">BloodBridge</th>
              </tr>
            </thead>
            <tbody className="bg-paper">
              {[
                ['Hospitals, NGOs and donors in one place', 'Blood banks only', 'Scattered', 'Yes'],
                ['Live stock and nearby search', 'Yes (can be outdated)', 'No', 'Yes'],
                ['Emergency requests to nearby donors', 'Limited (thalassemia)', 'Manual', 'Yes, one tap'],
                ['Verified donors and requests', 'Registered banks', 'No', 'Yes'],
                ['Eligibility tracking', 'Limited', 'No', 'Yes'],
                ['Works on low internet', 'App / web only', 'Needs internet', 'SMS fallback'],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-line">
                  {row.map((c, i) => (
                    <td key={i} className={`px-4 py-3 ${i === 3 ? 'font-semibold text-blood' : ''}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-4xl">Key features in this prototype</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.t} className="rounded-2xl bg-ivory p-5 ring-1 ring-line">
                <Check className="h-5 w-5 text-blood" />
                <div className="mt-3 font-semibold">{f.t}</div>
                <p className="mt-1 text-sm text-muted">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-4xl">Trust, safety, reach</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Mini icon={<ShieldCheck className="h-5 w-5" />} t="Verified donors" d="Profiles are checked before donors can respond." />
          <Mini icon={<Hospital className="h-5 w-5" />} t="Hospital dashboard" d="Blood banks post live stock levels." />
          <Mini icon={<Smartphone className="h-5 w-5" />} t="Privacy control" d="Your number is shared only after you accept." />
          <Mini icon={<MessageCircle className="h-5 w-5" />} t="SMS fallback" d="Requests still move on a weak connection." />
        </div>
        <Link to="/register" className="mt-10 inline-flex items-center gap-2 rounded-full bg-blood px-6 py-3 text-sm font-semibold text-ivory">
          Start as donor, hospital, bank or NGO <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blood">Expected impact</p>
          <h2 className="mt-2 font-display text-4xl">What this bridge is built to change.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Faster donor matching', 'Connect patients and hospitals with eligible nearby donors more quickly.'],
              ['More successful donations', 'Make it easier for donors to find requests that match their type and availability.'],
              ['Better emergency response', 'Send timely alerts for urgent blood needs, including an SMS fallback.'],
              ['Higher donor engagement', 'Encourage repeat donations with reminders, scheduling and progress tracking.'],
              ['Better coordination', 'Help hospitals and blood banks manage requests and availability in one place.'],
              ['Greater awareness', 'Make donation opportunities easier to discover and share.'],
            ].map(([t, d]) => (
              <Card key={t} title={t} body={d} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blood">Support</p>
        <h2 className="mt-2 max-w-2xl font-display text-4xl">Give money. Prize the people who give blood again.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card
            title="Donate to the organisation"
            body="A money gift keeps camps, SMS alerts and the matching desk running. Giving blood stays free."
          />
          <Card
            title="Prizes for regular donors"
            body="Come back to donate blood and unlock a certificate, a meal voucher, a health hamper, then an annual honour."
          />
        </div>
        <Link to="/support" className="mt-8 inline-flex rounded-full bg-blood px-5 py-2.5 text-sm font-semibold text-ivory">
          Support BloodBridge
        </Link>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blood">Conclusion</p>
        <h2 className="mt-2 font-display text-4xl">The right donor, at the right time.</h2>
        <p className="mt-4 text-muted">
          BloodBridge makes donation faster and easier, connects donors with people and hospitals, sends timely alerts,
          and turns one-time givers into regular donors. Together, we can bridge lives and build a healthier tomorrow.
        </p>
      </section>
    </main>
  )
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-2xl">{n}</div>
      <div className="mt-1 text-xs text-ivory/60">{l}</div>
    </div>
  )
}

function Pulse({ row, tag }: { row: string; tag: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-ivory/10 px-4 py-3">
      <span>{row}</span>
      <span className="rounded-full bg-blood px-2 py-0.5 text-[11px] font-semibold">{tag}</span>
    </div>
  )
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-paper p-5 ring-1 ring-line">
      <div className="font-display text-2xl">{title}</div>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  )
}

function Mini({ icon, t, d }: { icon: ReactNode; t: string; d: string }) {
  return (
    <div className="rounded-2xl border border-line p-4">
      <div className="text-blood">{icon}</div>
      <div className="mt-3 font-semibold">{t}</div>
      <p className="mt-1 text-sm text-muted">{d}</p>
    </div>
  )
}
