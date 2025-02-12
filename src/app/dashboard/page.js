'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MapComponent from '../MapComponent'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
    }
  }, [])

  return (
    <div>
      <MapComponent />
    </div>
  )
}
