import { useState } from 'react'
import { myths, news } from '../data/seed'

export function Awareness() {
  const [i, setI] = useState(0)
  const card = myths[i]

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-4xl">Awareness</h1>
      <p className="mt-2 text-muted">News and flashcards that bust common myths — so more people become regular donors.</p>

      <section className="mt-8">
        <h2 className="font-display text-2xl">Myth flashcards</h2>
        <div className="mt-4 rounded-3xl bg-blood-deep p-8 text-ivory">
          <p className="text-xs uppercase tracking-[0.2em] text-amber">Myth {i + 1} / {myths.length}</p>
          <p className="mt-3 font-display text-3xl italic">&ldquo;{card.myth}&rdquo;</p>
          <p className="mt-6 text-ivory/85">{card.fact}</p>
          <div className="mt-8 flex gap-2">
            <button type="button" className="rounded-full bg-ivory/10 px-4 py-2 text-sm" onClick={() => setI((n) => (n + myths.length - 1) % myths.length)}>
              Previous
            </button>
            <button type="button" className="rounded-full bg-ivory px-4 py-2 text-sm font-semibold text-blood-deep" onClick={() => setI((n) => (n + 1) % myths.length)}>
              Next myth
            </button>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Why this exists</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {news.map((n) => (
            <article key={n.title} className="rounded-2xl bg-paper p-4 ring-1 ring-line">
              <p className="text-xs text-blood">{n.source}</p>
              <h3 className="mt-2 font-semibold">{n.title}</h3>
              <p className="mt-2 text-sm text-muted">{n.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
