export type Role = 'donor' | 'patient' | 'hospital' | 'blood_bank' | 'ngo'
export type BloodType = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+'
export type Urgency = 'critical' | 'urgent' | 'scheduled'
export type RequestStatus = 'open' | 'matched' | 'fulfilled' | 'cancelled'
export type AppointmentKind = 'donation' | 'blood_test'
export type AppointmentStatus = 'booked' | 'completed' | 'cancelled'
export type NotifKind = 'match' | 'eligibility' | 'impact' | 'sms' | 'request' | 'stock'

export interface User {
  id: string
  name: string
  email: string
  password: string
  phone: string
  role: Role
  verified: boolean
  city: string
  lat: number
  lng: number
  bloodType?: BloodType
  lastDonation?: string
  nextEligible?: string
  orgName?: string
  licenseId?: string
  govtApproved?: boolean
}

export interface Facility {
  id: string
  name: string
  kind: 'hospital' | 'clinic' | 'blood_bank' | 'ngo'
  city: string
  address: string
  lat: number
  lng: number
  openForDonation: boolean
  govtApproved: boolean
  phone: string
  hours: string
}

export interface BloodRequest {
  id: string
  posterId: string
  patientName: string
  bloodType: BloodType
  units: number
  urgency: Urgency
  facilityId: string
  city: string
  lat: number
  lng: number
  notes: string
  status: RequestStatus
  verified: boolean
  createdAt: string
  acceptedBy?: string
  phoneShared?: boolean
  fulfilledAt?: string
}

export interface StockItem {
  facilityId: string
  units: Record<BloodType, number>
  updatedAt: string
}

export interface Appointment {
  id: string
  userId: string
  facilityId: string
  kind: AppointmentKind
  date: string
  time: string
  status: AppointmentStatus
}

export interface NotificationItem {
  id: string
  userId: string
  kind: NotifKind
  title: string
  body: string
  createdAt: string
  read: boolean
  requestId?: string
}

export interface ImpactStory {
  id: string
  donorId: string
  requestId: string
  headline: string
  body: string
  date: string
}

export interface MoneyGift {
  id: string
  userId: string | null
  name: string
  amount: number
  createdAt: string
}

export interface AppState {
  users: User[]
  facilities: Facility[]
  requests: BloodRequest[]
  stocks: StockItem[]
  appointments: Appointment[]
  notifications: NotificationItem[]
  impacts: ImpactStory[]
  gifts: MoneyGift[]
  sessionUserId: string | null
  lowInternet: boolean
}

export const BLOOD_TYPES: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
