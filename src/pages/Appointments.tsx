import { useState, type FormEvent } from 'react'
import { useStore } from '../store'
import type { AppointmentKind } from '../types'

export function Appointments() {
  const { facilities, appointments, currentUser, bookAppointment, completeAppointment } = useStore()
  const mine = appointments.filter((a) => a.userId === currentUser?.id)
  const [facilityId, setFacilityId] = useState(facilities[0]?.id ?? '')
  const [kind, setKind] = useState<AppointmentKind>('donation')
  const [date, setDate] = useState('2026-10-15')
  const [time, setTime] = useState('10:00')
  const [done, setDone] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    bookAppointment({ facilityId, kind, date, time })
    setDone(true)
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl">Appointment scheduler</h1>
      <p className="mt-2 text-sm text-muted">
        Book a donation slot or a free blood-type test so you know which patients you can help.
      </p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-2xl bg-paper p-5 ring-1 ring-line sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          Centre
          <select className="mt-1 w-full rounded-xl border border-line bg-ivory px-3 py-2" value={facilityId} onChange={(e) => setFacilityId(e.target.value)}>
            {facilities.filter((f) => f.openForDonation).map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Type
          <select className="mt-1 w-full rounded-xl border border-line bg-ivory px-3 py-2" value={kind} onChange={(e) => setKind(e.target.value as AppointmentKind)}>
            <option value="donation">Blood donation</option>
            <option value="blood_test">Free blood test</option>
          </select>
        </label>
        <label className="block text-sm">
          Date
          <input type="date" className="mt-1 w-full rounded-xl border border-line bg-ivory px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="block text-sm">
          Time
          <input type="time" className="mt-1 w-full rounded-xl border border-line bg-ivory px-3 py-2" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
        <div className="sm:col-span-2">
          <button className="rounded-full bg-blood px-5 py-2 text-sm font-semibold text-ivory">Confirm booking</button>
          {done && <span className="ml-3 text-sm text-emerald-800">Saved. You will get a reminder.</span>}
        </div>
      </form>

      <h2 className="mt-10 font-display text-2xl">Your bookings</h2>
      <ul className="mt-4 space-y-3">
        {mine.map((a) => (
          <li key={a.id} className="flex items-center justify-between rounded-2xl bg-paper px-4 py-3 ring-1 ring-line">
            <div>
              <div className="font-semibold capitalize">{a.kind.replace('_', ' ')}</div>
              <div className="text-sm text-muted">
                {a.date} · {a.time} · {a.status}
              </div>
            </div>
            {a.status === 'booked' && (
              <button type="button" className="text-sm text-blood" onClick={() => completeAppointment(a.id)}>
                Mark complete
              </button>
            )}
          </li>
        ))}
        {mine.length === 0 && <p className="text-sm text-muted">No bookings yet.</p>}
      </ul>
    </main>
  )
}
