import type { BloodType } from '../types'

/** Donor types that can give blood to a requested type. */
export const DONORS_FOR: Record<BloodType, BloodType[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
}

export function canDonate(donorType: BloodType, requestType: BloodType) {
  return DONORS_FOR[requestType].includes(donorType)
}

export function addWeeks(isoDate: string, weeks: number) {
  const d = new Date(isoDate)
  d.setDate(d.getDate() + weeks * 7)
  return d.toISOString().slice(0, 10)
}

export function isEligible(nextEligible?: string) {
  if (!nextEligible) return true
  return nextEligible <= new Date().toISOString().slice(0, 10)
}

export function daysUntil(iso?: string) {
  if (!iso) return 0
  const a = new Date(iso)
  const b = new Date()
  a.setHours(0, 0, 0, 0)
  b.setHours(0, 0, 0, 0)
  return Math.ceil((a.getTime() - b.getTime()) / 86400000)
}
