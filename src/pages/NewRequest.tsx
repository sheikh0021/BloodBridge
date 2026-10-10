import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { BLOOD_TYPES, type BloodType, type Urgency } from '../types'

export function NewRequest() {
  const { facilities, currentUser, postRequest } = useStore()
  const nav = useNavigate()
  const [patientName, setPatientName] = useState('')
  const [bloodType, setBloodType] = useState<BloodType>('O+')
  const [units, setUnits] = useState(1)
  const [urgency, setUrgency] = useState<Urgency>('critical')
  const [facilityId, setFacilityId] = useState(facilities[0]?.id ?? '')
  const [notes, setNotes] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const fac = facilities.find((f) => f.id === facilityId)
    if (!fac || !currentUser) return
    const req = postRequest({
      patientName: patientName || 'Anonymous patient',
      bloodType,
      units,
      urgency,
      facilityId,
      city: fac.city,
      lat: fac.lat,
      lng: fac.lng,
      notes,
    })
    nav(`/app/requests/${req.id}`)
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blood">Under a minute</p>
      <h1 className="mt-1 font-display text-4xl">Post a blood request</h1>
      <p className="mt-2 text-sm text-muted">
        One tap from hospitals, banks, NGOs or families. Nearby eligible donors are notified immediately — SMS if the
        network is weak.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm">
          Patient name (can stay anonymous)
          <input className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            Blood type
            <select className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" value={bloodType} onChange={(e) => setBloodType(e.target.value as BloodType)}>
              {BLOOD_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Units
            <input type="number" min={1} max={10} className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" value={units} onChange={(e) => setUnits(Number(e.target.value))} />
          </label>
        </div>
        <fieldset className="text-sm">
          <legend className="mb-2">Urgency</legend>
          <div className="flex flex-wrap gap-2">
            {(['critical', 'urgent', 'scheduled'] as Urgency[]).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUrgency(u)}
                className={`rounded-full px-3 py-1.5 capitalize ${urgency === u ? 'bg-blood text-ivory' : 'bg-paper ring-1 ring-line'}`}
              >
                {u}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm">
          Authorised hospital / bank
          <select className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" value={facilityId} onChange={(e) => setFacilityId(e.target.value)}>
            {facilities.filter((f) => f.govtApproved).map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} · {f.city}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Notes
          <textarea className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <button className="w-full rounded-full bg-blood py-2.5 text-sm font-semibold text-ivory">Notify nearby donors</button>
      </form>
    </main>
  )
}
