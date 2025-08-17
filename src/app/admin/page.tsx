'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Building2, 
  Clock, 
  Receipt, 
  BarChart3, 
  Settings, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  UserPlus,
  FolderPlus,
  FileText,
  ArrowRight
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  activeProjects: number
  pendingTimesheets: number
  pendingExpenses: number
  totalRevenue: number
  activeClients: number
  missingTimesheets: number
  overdueApprovals: number
}

export default function AdminDashboardPage() {
  const { appUser } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    activeProjects: 0,
    pendingTimesheets: 0,
    pendingExpenses: 0,
    totalRevenue: 0,
    activeClients: 0,
    missingTimesheets: 0,
    overdueApprovals: 0
  })

  useEffect(() => {
    // Simulate loading admin data
    setTimeout(() => {
      setAdminStats({
        totalUsers: 47,
        activeProjects: 12,
        pendingTimesheets: 8,
        pendingExpenses: 15,
        totalRevenue: 125000,
        activeClients: 8,
        missingTimesheets: 23,
        overdueApprovals: 5
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleCardClick = (route: string) => {
    router.push(route)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'employees':
        router.push('/admin/employees')
        break
      case 'clients':
        router.push('/admin/clients')
        break
      case 'timesheets':
        router.push('/admin/timesheets')
        break
      case 'expenses':
        router.push('/admin/expenses')
        break
      case 'reports':
        router.push('/admin/reports')
        break
      case 'settings':
        router.push('/admin/settings')
        break
      default:
        break
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e31c79] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header - EXACTLY matching Employee Dashboard */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {appUser?.first_name}!
            </h1>
            <p className="text-gray-600 mt-1">
              System Administrator • Full Access
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Admin
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Admin ID</p>
            <p className="font-mono text-gray-900">{appUser?.id}</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards - EXACTLY matching Employee Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="p-6 rounded-lg border bg-pink-50 text-pink-700 border-pink-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleCardClick('/admin/employees')}
        >
          <h3 className="text-sm font-medium opacity-75">Total Users</h3>
          <p className="text-2xl font-bold mt-1">{adminStats.totalUsers}</p>
          <p className="text-sm opacity-75 mt-1">Active employees</p>
        </div>

        <div 
          className="p-6 rounded-lg border bg-[#05202E]/10 text-[#05202E] border-[#05202E]/20 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleCardClick('/admin/clients')}
        >
          <h3 className="text-sm font-medium opacity-75">Active Clients</h3>
          <p className="text-2xl font-bold mt-1">{adminStats.activeClients}</p>
          <p className="text-sm opacity-75 mt-1">Current projects</p>
        </div>

        <div 
          className="p-6 rounded-lg border bg-[#E5DDD8]/50 text-[#05202E] border-[#E5DDD8] cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleCardClick('/admin/timesheets')}
        >
          <h3 className="text-sm font-medium opacity-75">Pending Timesheets</h3>
          <p className="text-2xl font-bold mt-1">{adminStats.pendingTimesheets}</p>
          <p className="text-sm opacity-75 mt-1">Awaiting review</p>
        </div>

        <div 
          className="p-6 rounded-lg border bg-pink-50 text-pink-700 border-pink-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleCardClick('/admin/expenses')}
        >
          <h3 className="text-sm font-medium opacity-75">Pending Expenses</h3>
          <p className="text-2xl font-bold mt-1">{adminStats.pendingExpenses}</p>
          <p className="text-sm opacity-75 mt-1">Awaiting approval</p>
        </div>
      </div>

      {/* Quick Actions - EXACTLY matching Employee Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="block p-6 rounded-lg border bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-700 transition-all hover:shadow-md cursor-pointer"
          onClick={() => handleQuickAction('employees')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Employee Management</h3>
                <p className="text-sm opacity-75">Manage team members</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 opacity-75" />
          </div>
        </div>

        <div 
          className="block p-6 rounded-lg border bg-[#05202E]/10 border-[#05202E]/20 hover:bg-[#05202E]/20 text-[#05202E] transition-all hover:shadow-md cursor-pointer"
          onClick={() => handleQuickAction('clients')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-white">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Client Management</h3>
                <p className="text-sm opacity-75">Manage client accounts</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 opacity-75" />
          </div>
        </div>

        <div 
          className="block p-6 rounded-lg border bg-[#E5DDD8]/50 border-[#E5DDD8] hover:bg-[#E5DDD8]/70 text-[#05202E] transition-all hover:shadow-md cursor-pointer"
          onClick={() => handleQuickAction('reports')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">System Reports</h3>
                <p className="text-sm opacity-75">Generate system reports</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 opacity-75" />
          </div>
        </div>

        <div 
          className="block p-6 rounded-lg border bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-700 transition-all hover:shadow-md cursor-pointer"
          onClick={() => handleQuickAction('settings')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-white">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">System Settings</h3>
                <p className="text-sm opacity-75">Configure system options</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 opacity-75" />
          </div>
        </div>
      </div>

      {/* System Overview - EXACTLY matching Employee Dashboard style */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Total Revenue</p>
                <p className="text-lg font-bold text-green-600">${adminStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Missing Timesheets</p>
                <p className="text-lg font-bold text-orange-600">{adminStats.missingTimesheets}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Overdue Approvals</p>
                <p className="text-lg font-bold text-blue-600">{adminStats.overdueApprovals}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FolderPlus className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Active Projects</p>
                <p className="text-lg font-bold text-purple-600">{adminStats.activeProjects}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
