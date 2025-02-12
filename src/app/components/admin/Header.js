'use client'
import { BellIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { UserIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Header({ setSidebarOpen }) {
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (data.name) {
          setUserName(data.name)
        }
      }
    }
    fetchUserData()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/auth/login')
  }

  return (
    <header className="bg-gradient-to-r from-slate-100 to-gray-100 shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center">
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          {/* This div will push the icons to the right */}
          <div className="flex-1"></div>
          
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-slate-200/70 transition-colors">
              <BellIcon className="h-6 w-6 text-slate-600" />
            </button>
            <div className="ml-3 group relative cursor-pointer">
              <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center ring-2 ring-white shadow-sm transform transition-all duration-300 group-hover:shadow-md group-hover:scale-110">
                <UserIcon className="h-5 w-5 text-slate-600" />
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-1 z-50">
                <div className="px-4 py-2 text-sm text-slate-600 border-b border-gray-100">
                  {userName || 'Admin User'}
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
)

}
