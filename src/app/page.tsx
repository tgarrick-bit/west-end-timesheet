'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { appUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (appUser) {
      router.push('/dashboard')
    } else {
      router.push('/auth/signin')
    }
  }, [appUser, router])

  return null
}
