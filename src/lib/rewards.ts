import type { BloodRequest, ImpactStory } from '../types'

export const PRIZES = [
  { at: 1, title: 'Thank-you certificate', detail: 'A named certificate after your first tracked donation.' },
  { at: 3, title: 'Centre meal voucher', detail: 'A meal at the donation centre, for donors who come back.' },
  { at: 5, title: 'Health hamper', detail: 'A checkup voucher and a small hamper after five donations.' },
  { at: 8, title: 'Annual honour', detail: 'Public thanks at the yearly camp, plus travel support to the next one.' },
]

export function bloodDonationCount(userId: string, impacts: ImpactStory[], requests: BloodRequest[]) {
  const ids = new Set<string>()
  for (const story of impacts) {
    if (story.donorId === userId) ids.add(story.requestId)
  }
  for (const request of requests) {
    if (request.status === 'fulfilled' && request.acceptedBy === userId) ids.add(request.id)
  }
  return ids.size
}
