import { Bell, Droplets, LogOut, Menu, Radio, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { useStore } from '../store'
import { roleLabel } from '../lib/format'

const publicLinks = [
  { to: '/how-it-works', label: 'How it works' },
  { to: '/awareness', label: 'Awareness' },
  { to: '/locator', label: 'Locator' },
  { to: '/support', label: 'Support' },
]

function appLinks(role?: string) {
  const base = [
    { to: '/app', label: 'Home' },
    { to: '/app/requests', label: 'Requests' },
    { to: '/app/locator', label: 'Locator' },
    { to: '/app/appointments', label: 'Appointments' },
    { to: '/app/awareness', label: 'Awareness' },
    { to: '/app/impact', label: 'Impact' },
    { to: '/app/support', label: 'Support' },
  ]
  if (role === 'hospital' || role === 'blood_bank' || role === 'ngo') {
    base.splice(2, 0, { to: '/app/stock', label: 'Live stock' })
  }
  return base
}

export function Shell() {
  const { currentUser, logout, unreadCount, lowInternet, toggleLowInternet } = useStore()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const inApp = loc.pathname.startsWith('/app')
  const links = inApp && currentUser ? appLinks(currentUser.role) : publicLinks

  return (
    <div className={`min-h-svh ${lowInternet ? 'sms-mode' : ''}`}>
      <header className="sticky top-0 z-30 border-b border-line/80 bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Link to={currentUser ? '/app' : '/'} onClick={() => setOpen(false)} className="shrink-0">
              <Logo size="sm" />
            </Link>
            <p className="truncate rounded-full bg-amber/25 px-2.5 py-1 text-xs ring-1 ring-amber/50 sm:px-3 sm:text-sm">
              <span className="font-semibold text-blood-deep">BloodBridge</span>
              <span className="text-blood-deep/70"> by </span>
              <span className="font-display text-sm text-blood sm:text-base">Sheikh Rayhaan</span>
            </p>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/app'}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 text-sm ${isActive ? 'bg-blood text-ivory' : 'text-muted hover:text-ink'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLowInternet}
              className={`hidden items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex ${
                lowInternet ? 'bg-ink text-ivory' : 'bg-line text-ink'
              }`}
              title="SMS fallback for weak connections"
            >
              <Radio className="h-3.5 w-3.5" />
              {lowInternet ? 'SMS fallback on' : 'Low internet'}
            </button>
            {currentUser ? (
              <>
                <Link to="/app/notifications" className="relative rounded-full p-2 hover:bg-line">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-blood px-1 text-[10px] text-ivory">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/app/profile" className="hidden text-right sm:block">
                  <div className="text-sm font-semibold leading-tight">{currentUser.name.split(' ')[0]}</div>
                  <div className="text-[11px] text-muted">{roleLabel(currentUser.role)}</div>
                </Link>
                <button type="button" onClick={logout} className="rounded-full p-2 hover:bg-line" aria-label="Sign out">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/login" className="rounded-full px-3 py-1.5 text-sm">
                  Sign in
                </Link>
                <Link to="/register" className="rounded-full bg-blood px-4 py-1.5 text-sm font-semibold text-ivory">
                  Join
                </Link>
              </div>
            )}
            <button type="button" className="rounded-full p-2 md:hidden" onClick={() => setOpen((v) => !v)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-line bg-paper px-4 py-3 md:hidden">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/app'}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm hover:bg-ivory"
              >
                {l.label}
              </NavLink>
            ))}
            {!currentUser && (
              <div className="mt-2 flex gap-2">
                <Link to="/login" className="flex-1 rounded-full border border-line py-2 text-center text-sm">
                  Sign in
                </Link>
                <Link to="/register" className="flex-1 rounded-full bg-blood py-2 text-center text-sm text-ivory">
                  Join
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {lowInternet && (
        <div className="bg-ink text-center text-xs text-ivory py-1.5">
          Weak connection mode — alerts go out as SMS. Numbers stay hidden until a donor accepts.
        </div>
      )}

      <Outlet />

      {currentUser && (
        <Link
          to="/app/request"
          className="fixed bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-full bg-blood px-4 py-3 text-sm font-semibold text-ivory shadow-lg shadow-blood/30"
        >
          <Droplets className="h-4 w-4" />
          One-tap request
        </Link>
      )}

      <footer className="mt-16 border-t border-line bg-blood-deep text-ivory">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
          <div>
            <Logo light />
            <p className="mt-3 max-w-sm text-sm text-ivory/75">
              We don&apos;t create another network. We connect the networks that already exist.
            </p>
          </div>
          <div className="text-sm text-ivory/80">
            <div className="font-semibold text-ivory">Prototype roles</div>
            <p className="mt-2">Donors · Patients · Hospitals · Blood banks · NGOs</p>
            <p className="mt-2">Free for patients and donors. Phone shared only after accept.</p>
          </div>
        </div>
        <div className="border-t border-ivory/15 px-4 py-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-amber">Made with love by</p>
          <p className="mt-2 font-display text-4xl text-ivory md:text-5xl">Sheikh Rayhaan</p>
        </div>
      </footer>
    </div>
  )
}
