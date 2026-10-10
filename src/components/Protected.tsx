import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../store'

export function Protected() {
  const { currentUser } = useStore()
  const loc = useLocation()
  if (!currentUser) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return <Outlet />
}
