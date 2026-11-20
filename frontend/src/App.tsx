import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import MainLayout from './components/MainLayout'
import LandingPage from './pages/LandingPage'
import TemplatePicker from './pages/TemplatePicker'
import AccountCreate from './pages/AccountCreate'
import BankDashboard from './pages/BankDashboard'
import BankLogin from './pages/BankLogin'
import AdminPanel from './pages/AdminPanel'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/templates" element={<TemplatePicker />} />
            <Route path="/create" element={<AccountCreate />} />
            <Route path="/dashboard/:accountId" element={<BankDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          <Route path="/login" element={<BankLogin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
