import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import TemplatePicker from './pages/TemplatePicker'
import AccountCreate from './pages/AccountCreate'
import BankDashboard from './pages/BankDashboard'
import BankLogin from './pages/BankLogin'
import AdminPanel from './pages/AdminPanel'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/templates" element={<TemplatePicker />} />
        <Route path="/create" element={<AccountCreate />} />
        <Route path="/login" element={<BankLogin />} />
        <Route path="/dashboard/:accountId" element={<BankDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}
