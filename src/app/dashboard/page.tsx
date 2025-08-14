'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import EmployeeDashboard from '@/components/EmployeeDashboard'
import AdminDashboard from '@/components/AdminDashboard'
import ClientApproverDashboard from '@/components/ClientApproverDashboard'
import PayrollDashboard from '@/components/PayrollDashboard'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default function DashboardPage() {
  const { user, appUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
    }
  }, [user, router])

  if (!user || !appUser) {
    return <LoadingSpinner />
  }

  // Role-based dashboard routing
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


