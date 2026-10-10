import { useEffect, useRef } from 'react'
import L from 'leaflet'

export type MapMarker = {
  id: string
  lat: number
  lng: number
  label: string
  sub?: string
  tone?: 'you' | 'place' | 'alert'
}

export function MapView({
  center,
  markers,
  zoom = 12,
}: {
  center: { lat: number; lng: number }
  markers: MapMarker[]
  zoom?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!ref.current) return
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }
    const map = L.map(ref.current, { zoomControl: true, attributionControl: true }).setView(
      [center.lat, center.lng],
      zoom,
    )
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)

    for (const m of markers) {
      const color = m.tone === 'you' ? '#1c1214' : m.tone === 'alert' ? '#8b1530' : '#d4922a'
      const icon = L.divIcon({
        className: 'map-pin',
        html: `<div style="width:16px;height:16px;border-radius:999px;background:${color};border:3px solid #fffaf3;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })
      L.marker([m.lat, m.lng], { icon }).addTo(map).bindPopup(`<strong>${m.label}</strong>${m.sub ? `<br/>${m.sub}` : ''}`)
    }

    mapRef.current = map
    setTimeout(() => map.invalidateSize(), 80)
    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, zoom, JSON.stringify(markers)])

  return <div ref={ref} className="h-full min-h-[280px] w-full rounded-2xl overflow-hidden ring-1 ring-line" />
}
