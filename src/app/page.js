'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      // If logged in, show map
      router.push('/dashboard')
    } else {
      // If not logged in, redirect to register
      router.push('/auth/register')
    }
  }, [])

  return null
}
