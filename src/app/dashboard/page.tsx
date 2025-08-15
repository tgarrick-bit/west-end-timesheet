'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'
import EmployeeDashboard from '@/components/EmployeeDashboard'
import ClientApproverDashboard from '@/components/ClientApproverDashboard'
import PayrollDashboard from '@/components/PayrollDashboard'

export default function DashboardPage() {
  const { appUser } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!appUser) {
      router.push('/auth/signin')
    } else {
      setIsLoading(false)
    }
  }, [appUser, router])

  if (isLoading || !appUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Render appropriate dashboard based on user role
  switch (appUser.role) {
    case 'admin':
      return <AdminDashboard user={appUser} />
    case 'employee':
      return <EmployeeDashboard user={appUser} />
    case 'client_approver':
      return <ClientApproverDashboard user={appUser} />
    case 'payroll':
      return <PayrollDashboard user={appUser} />
    default:
      return <EmployeeDashboard user={appUser} />
  }
}


