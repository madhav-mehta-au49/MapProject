'use client'
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  
  const router = useRouter()

  useEffect(() => {
    const checkTokenExpiration = () => {
      const lastLoginTime = localStorage.getItem('lastLoginTime')
      const currentTime = new Date().getTime()
      const oneHour = 60 * 60 * 1000 // 1 hour in milliseconds

      if (lastLoginTime && (currentTime - parseInt(lastLoginTime)) > oneHour) {
        localStorage.removeItem('token')
        localStorage.removeItem('lastLoginTime')
        router.push('/auth/login')
      }
    }

    checkTokenExpiration()
  }, [])

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
