import type { Role, Urgency } from '../types'

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`
}

export function nowIso() {
  return new Date().toISOString()
}

export function formatWhen(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function roleLabel(role: Role) {
  const map: Record<Role, string> = {
    donor: 'Donor',
    patient: 'Patient / Family',
    hospital: 'Hospital',
    blood_bank: 'Blood Bank',
    ngo: 'NGO',
  }
  return map[role]
}

export function urgencyLabel(u: Urgency) {
  if (u === 'critical') return 'Critical · now'
  if (u === 'urgent') return 'Urgent · today'
  return 'Scheduled'
}

export function maskPhone(phone: string) {
  if (phone.length < 4) return '••••••••'
  return `${phone.slice(0, 2)}••••••${phone.slice(-2)}`
}
