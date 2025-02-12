'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/admin/Sidebar'
import Header from '../components/admin/Header'
import { Toaster } from 'react-hot-toast'
import { Bars3Icon } from '@heroicons/react/24/outline'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const checkAdminAccess = () => {
      const token = localStorage.getItem('token')
      const isAdmin = localStorage.getItem('isAdmin')
      const lastLoginTime = localStorage.getItem('lastLoginTime')
      const currentTime = new Date().getTime()
      const oneHour = 60 * 60 * 1000

      if (!token || isAdmin !== 'true' || (currentTime - parseInt(lastLoginTime)) > oneHour) {
        localStorage.clear()
        router.replace('/auth/login')
        return
      }
      setIsLoading(false)
    }

    checkAdminAccess()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
          <Sidebar mobile={true} onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
          <Toaster position="top-right" />
        </main>
      </div>
    </div>
  )
}
