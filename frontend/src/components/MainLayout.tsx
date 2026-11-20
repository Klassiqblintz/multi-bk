import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function MainLayout() {
  const { userId } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const isSignedIn = !!userId

  return (
    <div className={`min-h-screen ${isSignedIn ? 'bg-gray-50' : 'bg-white'}`}>
      {isSignedIn && (
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      )}
      <main className={`transition-all duration-300 ${
        isSignedIn
          ? collapsed ? 'ml-12' : 'ml-0 lg:ml-80'
          : 'ml-0'
      }`}>
        <Outlet />
      </main>
    </div>
  )
}
