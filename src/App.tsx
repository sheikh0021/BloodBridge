import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './store'
import { Shell } from './components/Layout'
import { Protected } from './components/Protected'
import { Home } from './pages/Home'
import { HowItWorks } from './pages/HowItWorks'
import { Login, Register } from './pages/Auth'
import { Dashboard } from './pages/Dashboard'
import { Requests } from './pages/Requests'
import { NewRequest } from './pages/NewRequest'
import { RequestDetail } from './pages/RequestDetail'
import { Locator } from './pages/Locator'
import { Awareness } from './pages/Awareness'
import { Appointments } from './pages/Appointments'
import { Stock } from './pages/Stock'
import { NotificationsPage } from './pages/Notifications'
import { Impact } from './pages/Impact'
import { Profile } from './pages/Profile'
import { Support } from './pages/Support'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/awareness" element={<Awareness />} />
            <Route path="/locator" element={<Locator />} />
            <Route path="/support" element={<Support />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Protected />}>
              <Route path="/app" element={<Dashboard />} />
              <Route path="/app/requests" element={<Requests />} />
              <Route path="/app/request" element={<NewRequest />} />
              <Route path="/app/requests/:id" element={<RequestDetail />} />
              <Route path="/app/locator" element={<Locator />} />
              <Route path="/app/awareness" element={<Awareness />} />
              <Route path="/app/appointments" element={<Appointments />} />
              <Route path="/app/stock" element={<Stock />} />
              <Route path="/app/notifications" element={<NotificationsPage />} />
              <Route path="/app/impact" element={<Impact />} />
              <Route path="/app/support" element={<Support />} />
              <Route path="/app/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
