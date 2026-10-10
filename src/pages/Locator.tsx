import { useEffect, useState } from 'react'
import { MapView } from '../components/MapView'
import { Badge } from '../components/Badge'
import { useStore } from '../store'
import { formatKm } from '../lib/geo'

const defaultOrigin = { lat: 28.6139, lng: 77.209 }

export function Locator() {
  const { nearbyFacilities, currentUser } = useStore()
  const [origin, setOrigin] = useState(currentUser ?? defaultOrigin)
  const [note, setNote] = useState('Using demo location (Delhi) until you allow GPS.')

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setNote('Using your live location to rank authorised centres.')
      },
      () => setNote('Location permission skipped. Showing Delhi-area authorised centres.'),
    )
  }, [])

  const list = nearbyFacilities(origin)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl">Hospital & clinic locator</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Only govt-approved, donation-open hospitals, clinics, banks and NGO desks. Accountability first — no unverified
        collection camps on this map.
      </p>
      <p className="mt-2 text-xs text-amber">{note}</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="h-[420px]">
          <MapView
            center={origin}
            zoom={11}
            markers={[
              { id: 'you', lat: origin.lat, lng: origin.lng, label: 'You', tone: 'you' },
              ...list.slice(0, 12).map(({ facility }) => ({
                id: facility.id,
                lat: facility.lat,
                lng: facility.lng,
                label: facility.name,
                sub: facility.hours,
                tone: 'place' as const,
              })),
            ]}
          />
        </div>
        <ul className="space-y-3">
          {list.map(({ facility, km }) => (
            <li key={facility.id} className="rounded-2xl bg-paper p-4 ring-1 ring-line">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{facility.name}</div>
                  <div className="text-sm text-muted">{facility.address}</div>
                  <div className="mt-1 text-xs text-muted">{facility.hours} · {facility.phone}</div>
                </div>
                <div className="text-right">
                  <Badge tone="ok">Govt approved</Badge>
                  <div className="mt-2 text-sm">{formatKm(km)}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
