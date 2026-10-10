import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { seed } from './data/seed'
import { canDonate, isEligible, addWeeks } from './lib/blood'
import { haversineKm } from './lib/geo'
import { nowIso, uid } from './lib/format'
import type {
  AppState,
  Appointment,
  BloodRequest,
  BloodType,
  NotificationItem,
  Role,
  User,
} from './types'

const KEY = 'bloodbridge.v2'

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(seed)
    const saved = JSON.parse(raw) as AppState
    const base = structuredClone(seed)
    const seen = new Set((saved.impacts ?? []).map((story) => story.id))
    return {
      ...base,
      ...saved,
      users: (saved.users ?? base.users).map((user) => (user.id === 'u_donor' ? { ...user, name: 'Sheikh Rayhaan' } : user)),
      gifts: saved.gifts ?? [],
      impacts: [...(saved.impacts ?? []), ...base.impacts.filter((story) => !seen.has(story.id))],
    }
  } catch {
    return structuredClone(seed)
  }
}

type Store = AppState & {
  currentUser: User | null
  login: (email: string, password: string) => string | null
  logout: () => void
  register: (user: Omit<User, 'id' | 'verified'> & { verified?: boolean }) => string | null
  toggleLowInternet: () => void
  postRequest: (input: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'verified' | 'posterId'> & { posterId?: string }) => BloodRequest
  acceptRequest: (requestId: string) => string | null
  reachOut: (requestId: string, donorId: string) => string | null
  fulfillRequest: (requestId: string) => void
  bookAppointment: (input: Omit<Appointment, 'id' | 'status' | 'userId'>) => Appointment
  completeAppointment: (id: string) => void
  updateStock: (facilityId: string, type: BloodType, units: number) => void
  markRead: (id: string) => void
  giveMoney: (amount: number, name: string) => string | null
  nearbyFacilities: (origin?: { lat: number; lng: number }) => { facility: AppState['facilities'][number]; km: number }[]
  matchesFor: (request: BloodRequest) => { donor: User; km: number }[]
  facilityOf: (id: string) => AppState['facilities'][number] | undefined
  userById: (id: string) => User | undefined
  unreadCount: number
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const currentUser = state.users.find((u) => u.id === state.sessionUserId) ?? null

  const value = useMemo<Store>(() => {
    const notify = (list: NotificationItem[], item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
      list.push({ ...item, id: uid('n'), createdAt: nowIso(), read: false })
    }

    return {
      ...state,
      currentUser,
      unreadCount: state.notifications.filter((n) => n.userId === state.sessionUserId && !n.read).length,
      userById: (id) => state.users.find((u) => u.id === id),
      facilityOf: (id) => state.facilities.find((f) => f.id === id),
      toggleLowInternet: () => setState((s) => ({ ...s, lowInternet: !s.lowInternet })),
      login: (email, password) => {
        const user = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
        if (!user) return 'No matching account. Try a demo login.'
        setState((s) => ({ ...s, sessionUserId: user.id }))
        return null
      },
      logout: () => setState((s) => ({ ...s, sessionUserId: null })),
      register: (input) => {
        if (state.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
          return 'An account with this email already exists.'
        }
        const user: User = {
          ...input,
          id: uid('u'),
          verified: input.role === 'donor' ? false : Boolean(input.govtApproved),
        }
        const notes: NotificationItem[] = []
        if (user.role === 'donor') {
          notes.push({
            id: uid('n'),
            userId: user.id,
            kind: 'request',
            title: 'Verification in progress',
            body: 'Your donor profile is being checked. You can browse requests; accepting opens after verification.',
            createdAt: nowIso(),
            read: false,
          })
        }
        setState((s) => ({
          ...s,
          users: [...s.users, user],
          sessionUserId: user.id,
          notifications: [...s.notifications, ...notes],
        }))
        return null
      },
      nearbyFacilities: (origin) => {
        const from = origin ?? currentUser ?? { lat: 28.6139, lng: 77.209 }
        return state.facilities
          .filter((f) => f.openForDonation && f.govtApproved)
          .map((facility) => ({ facility, km: haversineKm(from, facility) }))
          .sort((a, b) => a.km - b.km)
      },
      matchesFor: (request) =>
        state.users
          .filter((u) => u.role === 'donor' && u.verified && u.bloodType && canDonate(u.bloodType, request.bloodType) && isEligible(u.nextEligible))
          .map((donor) => ({ donor, km: haversineKm(donor, request) }))
          .sort((a, b) => a.km - b.km),
      postRequest: (input) => {
        const poster = state.users.find((u) => u.id === (input.posterId || state.sessionUserId))
        const request: BloodRequest = {
          ...input,
          posterId: poster?.id ?? 'unknown',
          id: uid('r'),
          createdAt: nowIso(),
          status: 'open',
          verified: poster?.role !== 'patient' || Boolean(poster?.verified),
        }
        setState((s) => {
          const notifications = [...s.notifications]
          const donors = s.users.filter(
            (u) => u.role === 'donor' && u.verified && u.bloodType && canDonate(u.bloodType, request.bloodType) && isEligible(u.nextEligible),
          )
          for (const donor of donors) {
            const km = haversineKm(donor, request)
            if (km > 80 && donor.city !== request.city) continue
            const sms = s.lowInternet
            notify(notifications, {
              userId: donor.id,
              kind: sms ? 'sms' : 'match',
              requestId: request.id,
              title: sms ? `SMS · ${request.bloodType} needed` : `${request.urgency === 'critical' ? 'Critical' : 'New'} ${request.bloodType} request`,
              body: sms
                ? `BloodBridge: ${request.units}u ${request.bloodType} at ${s.facilities.find((f) => f.id === request.facilityId)?.name}. Reply ACCEPT ${request.id.slice(-4).toUpperCase()}`
                : `${request.units} unit(s) at ${s.facilities.find((f) => f.id === request.facilityId)?.name}, ${request.city} · ${km.toFixed(1)} km away.`,
            })
          }
          return { ...s, requests: [request, ...s.requests], notifications }
        })
        return request
      },
      acceptRequest: (requestId) => {
        if (!currentUser) return 'Sign in as a donor first.'
        if (currentUser.role !== 'donor') return 'Only donors can accept a match.'
        if (!currentUser.verified) return 'Your donor profile is still being verified.'
        if (!isEligible(currentUser.nextEligible)) return `You can donate again on ${currentUser.nextEligible}.`
        const req = state.requests.find((r) => r.id === requestId)
        if (!req || req.status === 'fulfilled' || req.status === 'cancelled') return 'This request is no longer open.'
        if (!currentUser.bloodType || !canDonate(currentUser.bloodType, req.bloodType)) return 'Your blood type cannot fill this request.'

        setState((s) => {
          const notifications = [...s.notifications]
          notify(notifications, {
            userId: req.posterId,
            kind: 'request',
            requestId,
            title: 'A verified donor accepted',
            body: `${currentUser.name} accepted. Phone numbers are now visible to both of you.`,
          })
          notify(notifications, {
            userId: currentUser.id,
            kind: 'request',
            requestId,
            title: 'Number unlocked',
            body: 'The requester can see your phone only because you accepted. Coordinate the donation at the listed hospital.',
          })
          return {
            ...s,
            requests: s.requests.map((r) =>
              r.id === requestId ? { ...r, status: 'matched', acceptedBy: currentUser.id, phoneShared: true } : r,
            ),
            notifications,
          }
        })
        return null
      },
      reachOut: (requestId, donorId) => {
        if (!currentUser) return 'Sign in to connect with a donor.'
        if (currentUser.role === 'donor') return 'Donors accept a request. The person who posted it connects by email.'
        const req = state.requests.find((r) => r.id === requestId)
        if (!req || req.status === 'cancelled' || req.status === 'fulfilled') return 'This request is no longer open.'
        const donor = state.users.find((u) => u.id === donorId && u.role === 'donor')
        if (!donor) return 'That donor is no longer on this match.'
        setState((s) => {
          const notifications = [...s.notifications]
          notify(notifications, {
            userId: donor.id,
            kind: 'request',
            requestId,
            title: `${currentUser.name} wants to connect`,
            body: `They need ${req.bloodType} and reached out by email. Reply at ${currentUser.email}.`,
          })
          notify(notifications, {
            userId: currentUser.id,
            kind: 'request',
            requestId,
            title: `You can reach ${donor.name}`,
            body: `Sample contact for this match: ${donor.email}`,
          })
          return { ...s, notifications }
        })
        return null
      },
      fulfillRequest: (requestId) => {
        setState((s) => {
          const req = s.requests.find((r) => r.id === requestId)
          if (!req?.acceptedBy) return s
          const donor = s.users.find((u) => u.id === req.acceptedBy)
          const today = nowIso().slice(0, 10)
          const next = addWeeks(today, 12)
          const notifications = [...s.notifications]
          if (donor) {
            notify(notifications, {
              userId: donor.id,
              kind: 'eligibility',
              title: 'Next eligible date saved',
              body: `Thank you. You can donate again on ${next} (12-week gap). We will remind you.`,
            })
            notify(notifications, {
              userId: donor.id,
              kind: 'impact',
              requestId,
              title: 'You helped someone today',
              body: `Your ${req.bloodType} units are being used for ${req.patientName} at ${s.facilities.find((f) => f.id === req.facilityId)?.name}.`,
            })
          }
          return {
            ...s,
            requests: s.requests.map((r) => (r.id === requestId ? { ...r, status: 'fulfilled', fulfilledAt: nowIso() } : r)),
            users: s.users.map((u) => (u.id === req.acceptedBy ? { ...u, lastDonation: today, nextEligible: next } : u)),
            impacts: [
              {
                id: uid('i'),
                donorId: req.acceptedBy,
                requestId,
                headline: 'Donation tracked',
                body: `You helped ${req.patientName}. Next eligible date: ${next}.`,
                date: today,
              },
              ...s.impacts,
            ],
            notifications,
          }
        })
      },
      bookAppointment: (input) => {
        const appt: Appointment = { ...input, id: uid('a'), userId: currentUser?.id ?? 'guest', status: 'booked' }
        setState((s) => {
          const notifications = [...s.notifications]
          if (currentUser) {
            notify(notifications, {
              userId: currentUser.id,
              kind: 'request',
              title: input.kind === 'blood_test' ? 'Free blood-type test booked' : 'Donation appointment booked',
              body: `${input.date} at ${input.time} · ${s.facilities.find((f) => f.id === input.facilityId)?.name}`,
            })
          }
          return { ...s, appointments: [appt, ...s.appointments], notifications }
        })
        return appt
      },
      completeAppointment: (id) => {
        setState((s) => {
          const appt = s.appointments.find((a) => a.id === id)
          if (!appt) return s
          let users = s.users
          const notifications = [...s.notifications]
          if (appt.kind === 'blood_test') {
            const guessed: BloodType = 'A+'
            users = s.users.map((u) => (u.id === appt.userId ? { ...u, bloodType: u.bloodType ?? guessed } : u))
            notify(notifications, {
              userId: appt.userId,
              kind: 'impact',
              title: 'Blood type recorded',
              body: 'Your free test is marked complete. In a live build this comes from the lab; this prototype assigns a type so matching can run.',
            })
          }
          return {
            ...s,
            users,
            notifications,
            appointments: s.appointments.map((a) => (a.id === id ? { ...a, status: 'completed' } : a)),
          }
        })
      },
      updateStock: (facilityId, type, units) => {
        setState((s) => ({
          ...s,
          stocks: s.stocks.map((st) =>
            st.facilityId === facilityId ? { ...st, units: { ...st.units, [type]: Math.max(0, units) }, updatedAt: nowIso() } : st,
          ),
        }))
      },
      markRead: (id) =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      giveMoney: (amount, name) => {
        const rupees = Math.round(amount)
        if (!Number.isFinite(rupees) || rupees < 50) return 'Choose at least ₹50.'
        const giver = name.trim() || currentUser?.name || 'A friend'
        setState((s) => {
          const notifications = [...s.notifications]
          if (currentUser) {
            notify(notifications, {
              userId: currentUser.id,
              kind: 'impact',
              title: 'Thank you for the gift',
              body: `₹${rupees.toLocaleString('en-IN')} is recorded for camps, reminders and emergency matching. This prototype does not charge a real card.`,
            })
          }
          return {
            ...s,
            notifications,
            gifts: [
              { id: uid('g'), userId: currentUser?.id ?? null, name: giver, amount: rupees, createdAt: nowIso() },
              ...(s.gifts ?? []),
            ],
          }
        })
        return null
      },
    }
  }, [state, currentUser])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Store missing')
  return ctx
}

export const roleOptions: { id: Role; label: string; hint: string }[] = [
  { id: 'donor', label: 'Donor', hint: 'Get matched, book slots, track eligibility' },
  { id: 'patient', label: 'Patient / family', hint: 'Post a request in under a minute' },
  { id: 'hospital', label: 'Hospital', hint: 'Verified requests and live stock' },
  { id: 'blood_bank', label: 'Blood bank', hint: 'Post units and accept walk-ins' },
  { id: 'ngo', label: 'NGO', hint: 'Connect your existing donor network' },
]
