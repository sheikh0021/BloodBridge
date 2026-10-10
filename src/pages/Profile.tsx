import { useStore } from '../store'
import { Badge } from '../components/Badge'
import { roleLabel } from '../lib/format'
import { isEligible } from '../lib/blood'

export function Profile() {
  const { currentUser } = useStore()
  if (!currentUser) return null

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="font-display text-4xl">Your profile</h1>
      <div className="mt-6 space-y-3 rounded-2xl bg-paper p-5 ring-1 ring-line text-sm">
        <Row k="Name" v={currentUser.name} />
        <Row k="Role" v={roleLabel(currentUser.role)} />
        <Row k="City" v={currentUser.city} />
        <Row k="Email" v={currentUser.email} />
        <Row k="Phone" v={currentUser.phone} />
        {currentUser.bloodType && <Row k="Blood type" v={currentUser.bloodType} />}
        {currentUser.orgName && <Row k="Organisation" v={currentUser.orgName} />}
        {currentUser.licenseId && <Row k="Licence" v={currentUser.licenseId} />}
        <div className="flex gap-2 pt-2">
          {currentUser.verified ? <Badge tone="ok">Verified</Badge> : <Badge tone="warn">Verification pending</Badge>}
          {currentUser.govtApproved && <Badge tone="ok">Govt approved docs</Badge>}
          {currentUser.role === 'donor' && (
            <Badge tone={isEligible(currentUser.nextEligible) ? 'ok' : 'muted'}>
              {isEligible(currentUser.nextEligible) ? 'Eligible now' : `Next ${currentUser.nextEligible}`}
            </Badge>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">
        Privacy: other users see your number only after you accept a request. Free for patients and donors.
      </p>
    </main>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line/70 py-2">
      <span className="text-muted">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  )
}
