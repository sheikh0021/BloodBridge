import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BLOOD_TYPES, type BloodType, type Role } from '../types'
import { roleOptions, useStore } from '../store'

const demos = [
  { email: 'donor@bloodbridge.in', role: 'Donor · Sheikh Rayhaan (O+ Delhi)' },
  { email: 'patient@bloodbridge.in', role: 'Family · Kavya' },
  { email: 'hospital@bloodbridge.in', role: 'AIIMS desk' },
  { email: 'bank@bloodbridge.in', role: 'Red Cross bank' },
  { email: 'ngo@bloodbridge.in', role: 'Sankalp NGO' },
]

export function Login() {
  const { login } = useStore()
  const nav = useNavigate()
  const loc = useLocation()
  const from = (loc.state as { from?: string } | null)?.from ?? '/app'
  const [email, setEmail] = useState('donor@bloodbridge.in')
  const [password, setPassword] = useState('demo')
  const [err, setErr] = useState<string | null>(null)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const msg = login(email, password)
    if (msg) setErr(msg)
    else nav(from)
  }

  return (
    <main className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-muted">Every demo password is <code className="rounded bg-line px-1">demo</code>.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field label="Email" value={email} onChange={setEmail} />
        <Field label="Password" value={password} onChange={setPassword} type="password" />
        {err && <p className="text-sm text-blood">{err}</p>}
        <button className="w-full rounded-full bg-blood py-2.5 text-sm font-semibold text-ivory">Enter BloodBridge</button>
      </form>
      <div className="mt-6 space-y-2">
        {demos.map((d) => (
          <button
            key={d.email}
            type="button"
            onClick={() => {
              setEmail(d.email)
              setPassword('demo')
            }}
            className="flex w-full items-center justify-between rounded-xl bg-paper px-3 py-2 text-left text-sm ring-1 ring-line"
          >
            <span>{d.role}</span>
            <span className="text-muted">{d.email}</span>
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm">
        New here? <Link to="/register" className="font-semibold text-blood">Create an account</Link>
      </p>
    </main>
  )
}

export function Register() {
  const { register } = useStore()
  const nav = useNavigate()
  const [role, setRole] = useState<Role>('donor')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('demo')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('New Delhi')
  const [bloodType, setBloodType] = useState<BloodType | ''>('')
  const [orgName, setOrgName] = useState('')
  const [licenseId, setLicenseId] = useState('')
  const [err, setErr] = useState<string | null>(null)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const org = role === 'hospital' || role === 'blood_bank' || role === 'ngo'
    const msg = register({
      name: name || 'New member',
      email,
      password,
      phone: phone || '9000000000',
      role,
      city,
      lat: city.toLowerCase().includes('patna') ? 25.61 : city.toLowerCase().includes('mumbai') ? 19.07 : 28.61,
      lng: city.toLowerCase().includes('patna') ? 85.14 : city.toLowerCase().includes('mumbai') ? 72.87 : 77.21,
      bloodType: bloodType || undefined,
      orgName: org ? orgName : undefined,
      licenseId: org ? licenseId : undefined,
      govtApproved: org,
    })
    if (msg) setErr(msg)
    else nav('/app')
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-14">
      <h1 className="font-display text-4xl">Join the bridge</h1>
      <p className="mt-2 text-sm text-muted">Pick the network you already belong to. We will not make you start over.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          {roleOptions.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`rounded-2xl p-3 text-left ring-1 ${role === r.id ? 'bg-blood text-ivory ring-blood' : 'bg-paper ring-line'}`}
            >
              <div className="font-semibold">{r.label}</div>
              <div className={`text-xs ${role === r.id ? 'text-ivory/80' : 'text-muted'}`}>{r.hint}</div>
            </button>
          ))}
        </div>
        <Field label="Full name" value={name} onChange={setName} />
        <Field label="Email" value={email} onChange={setEmail} />
        <Field label="Phone" value={phone} onChange={setPhone} />
        <Field label="City" value={city} onChange={setCity} />
        {role === 'donor' && (
          <label className="block text-sm">
            Blood type (optional — book a free test if you don&apos;t know)
            <select
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value as BloodType | '')}
            >
              <option value="">I don&apos;t know yet</option>
              {BLOOD_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        )}
        {(role === 'hospital' || role === 'blood_bank' || role === 'ngo') && (
          <>
            <Field label="Organisation name" value={orgName} onChange={setOrgName} />
            <Field label="Licence / registration ID" value={licenseId} onChange={setLicenseId} />
            <p className="text-xs text-muted">Accountability: documents are checked before this organisation can post as verified.</p>
          </>
        )}
        <Field label="Password" value={password} onChange={setPassword} type="password" />
        {err && <p className="text-sm text-blood">{err}</p>}
        <button className="w-full rounded-full bg-blood py-2.5 text-sm font-semibold text-ivory">Create account</button>
      </form>
    </main>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        type={type}
        required={label === 'Email'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
      />
    </label>
  )
}
