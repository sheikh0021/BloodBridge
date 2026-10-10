import { useStore } from '../store'

export function Impact() {
  const { currentUser, impacts, requests } = useStore()
  const mine = impacts.filter((i) => !currentUser || currentUser.role !== 'donor' || i.donorId === currentUser.id)

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl">Transparency</h1>
      <p className="mt-2 text-muted">
        Donors are told how their blood was used — without exposing a patient&apos;s private number. That loop is what
        turns a one-time donor into a regular.
      </p>
      <div className="mt-8 space-y-4">
        {mine.map((i) => (
          <article key={i.id} className="rounded-2xl bg-paper p-5 ring-1 ring-line">
            <p className="text-xs text-blood">{i.date}</p>
            <h2 className="mt-1 font-display text-2xl">{i.headline}</h2>
            <p className="mt-2 text-sm text-muted">{i.body}</p>
          </article>
        ))}
      </div>
      <section className="mt-12 rounded-2xl bg-blood-deep p-6 text-ivory">
        <h2 className="font-display text-2xl">Expected impact of this prototype</h2>
        <ul className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <li>Faster matching of eligible nearby donors</li>
          <li>More successful donations of the right type</li>
          <li>Better emergency response with one-tap alerts</li>
          <li>Higher engagement via reminders and tracking</li>
          <li>Hospitals and banks coordinating on one board</li>
          <li>Awareness that is easy to share</li>
        </ul>
        <p className="mt-4 text-xs text-ivory/60">{requests.filter((r) => r.status === 'fulfilled').length} fulfilled request(s) in this demo session.</p>
      </section>
    </main>
  )
}
