'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/auth/signin')
  }, [router])

  return (
    <div className="min-h-screen bg-[#05202E] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#e31c79] rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">WE</span>
        </div>
        <p className="text-white">Loading West End Workforce...</p>
      </div>
    </div>
  )
}