'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
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
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { User } from '@/types'
import ClientsAndProjects from './ClientsAndProjects'
import EmployeeManagement from './EmployeeManagement'
import PendingApprovals from './PendingApprovals'
import SystemReports from './SystemReports'
import AdminTimesheetManagement from './AdminTimesheetManagement'
import AdminExpenseManagement from './AdminExpenseManagement'
import AdminSettings from './AdminSettings'


interface AdminDashboardProps {
  user: User
}

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

interface RecentSubmission {
  id: string
  user: string
  type: 'timesheet' | 'expense'
  project: string
  amount?: number
  hours?: number
  date: string
  status: 'pending' | 'approved' | 'rejected'
}

interface SystemAlert {
  id: string
  type: 'warning' | 'error' | 'info'
  message: string
  count: number
  action: string
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
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
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([])
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([])

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    // Simulate fetching admin data
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
      
      setRecentSubmissions([
        {
          id: '1',
          user: 'Sarah Johnson',
          type: 'timesheet',
          project: 'Downtown Office Renovation',
          hours: 40,
          date: '2024-01-15',
          status: 'pending'
        },
        {
          id: '2',
          user: 'Mike Chen',
          type: 'expense',
          project: 'Tech Infrastructure',
          amount: 245.50,
          date: '2024-01-14',
          status: 'pending'
        },
        {
          id: '3',
          user: 'Lisa Rodriguez',
          type: 'timesheet',
          project: 'Warehouse Expansion',
          hours: 38.5,
          date: '2024-01-13',
          status: 'approved'
        },
        {
          id: '4',
          user: 'David Thompson',
          type: 'expense',
          project: 'Marketing Campaign',
          amount: 89.99,
          date: '2024-01-12',
          status: 'rejected'
        }
      ])

      setSystemAlerts([
        {
          id: '1',
          type: 'warning',
          message: 'Missing timesheets from last week',
          count: 23,
          action: 'Send reminders'
        },
        {
          id: '2',
          type: 'error',
          message: 'Overdue approvals',
          count: 5,
          action: 'Escalate'
        },
        {
          id: '3',
          type: 'info',
          message: 'New expense reports submitted',
          count: 12,
          action: 'Review'
        }
      ])
    }, 1000)
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, active: activeSection === 'dashboard' },
    { id: 'users', label: 'User Management', icon: Users, active: activeSection === 'users' },
    { id: 'clients', label: 'Clients & Projects', icon: Building2, active: activeSection === 'clients' },
    { id: 'pending', label: 'Pending Approvals', icon: FileText, active: activeSection === 'pending' },
    { id: 'reports', label: 'System Reports', icon: TrendingUp, active: activeSection === 'reports' },
    { id: 'timesheets', label: 'Timesheets', icon: Clock, active: activeSection === 'timesheets' },
    { id: 'expenses', label: 'Expenses', icon: Receipt, active: activeSection === 'expenses' },
    { id: 'settings', label: 'System Settings', icon: Settings, active: activeSection === 'settings' }
  ]

  const quickActions = [
    { label: 'Add Employee', icon: UserPlus, action: () => setActiveSection('users') },
    { label: 'Create Project', icon: FolderPlus, action: () => setActiveSection('clients') },
    { label: 'View Pending', icon: FileText, action: () => setActiveSection('pending') },
    { label: 'System Report', icon: BarChart3, action: () => setActiveSection('reports') }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: X }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#05202E] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <div className="flex items-center">
            <span className="text-white font-semibold text-lg">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      item.active
                        ? 'bg-[#e31c79] text-white shadow-sm'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <div className="text-white text-sm">
            <p className="font-medium truncate">{user.first_name} {user.last_name}</p>
            <p className="text-gray-300 text-xs">Administrator</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-2xl font-bold text-[#232020]">System Administration</h1>
                <p className="text-[#465079]">Welcome back, {user.first_name} {user.last_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-[#465079]">Role</p>
                <p className="text-sm font-medium text-[#232020] capitalize">{user.role.replace('_', ' ')}</p>
              </div>
              <button
                onClick={signOut}
                className="ml-4 px-4 py-2 text-[#465079] hover:text-[#e31c79] hover:bg-gray-100 rounded-lg transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Main dashboard content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              {/* System Alerts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-[#232020] mb-6">System Alerts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                      <div className="flex items-start">
                        {getAlertIcon(alert.type)}
                        <div className="ml-3 flex-1">
                          <p className="font-medium text-[#232020]">{alert.message}</p>
                          <p className="text-sm text-[#465079] mt-1">
                            {alert.count} items require attention
                          </p>
                          <button className="mt-2 text-sm font-medium text-[#e31c79] hover:text-[#d4156a]">
                            {alert.action}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timesheet Management Card */}
              <div className="bg-gradient-to-r from-[#e31c79] to-[#d4156a] rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-full">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Timesheet Management</h2>
                      <p className="text-pink-100 mt-1">Monitor and manage employee timesheets</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setActiveSection('timesheets')}
                      className="flex items-center px-6 py-3 bg-white text-[#e31c79] rounded-lg font-semibold hover:bg-pink-50 transition-colors shadow-sm"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      View All Timesheets
                    </button>
                    <button 
                      onClick={() => setActiveSection('pending')}
                      className="flex items-center px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg font-semibold hover:bg-white hover:text-[#e31c79] transition-colors"
                    >
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Pending Approvals
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h2 className="text-xl font-semibold text-[#232020] mb-6">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-[#e31c79]">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-[#465079]">Total Users</p>
                        <p className="text-2xl font-semibold text-[#232020]">{adminStats.totalUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-[#465079]">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-[#465079]">Active Projects</p>
                        <p className="text-2xl font-semibold text-[#232020]">{adminStats.activeProjects}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-red-500">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-[#465079]">Missing Timesheets</p>
                        <p className="text-2xl font-semibold text-[#232020]">{adminStats.missingTimesheets}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-yellow-500">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-[#465079]">Overdue Approvals</p>
                        <p className="text-2xl font-semibold text-[#232020]">{adminStats.overdueApprovals}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-[#e31c79]">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[#465079]">Pending Timesheets</p>
                      <p className="text-2xl font-semibold text-[#232020]">{adminStats.pendingTimesheets}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-[#465079]">
                      <Receipt className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[#465079]">Pending Expenses</p>
                      <p className="text-2xl font-semibold text-[#232020]">{adminStats.pendingExpenses}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-[#e31c79]">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[#465079]">Monthly Revenue</p>
                      <p className="text-2xl font-semibold text-[#232020]">${adminStats.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-xl font-semibold text-[#232020] mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={index}
                        onClick={action.action}
                        className="flex items-center justify-center px-6 py-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-[#e31c79] transition-all duration-200 group"
                      >
                        <Icon className="h-6 w-6 text-[#465079] group-hover:text-[#e31c79] mr-3" />
                        <span className="font-medium text-[#232020] group-hover:text-[#e31c79]">
                          {action.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Recent Submissions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Timesheets */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-[#232020]">Recent Timesheet Submissions</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentSubmissions
                        .filter(sub => sub.type === 'timesheet')
                        .slice(0, 5)
                        .map((submission) => (
                          <div key={submission.id} className="flex items-center justify-between p-4 bg-[#e5ddd8] rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-[#232020]">{submission.user}</p>
                              <p className="text-sm text-[#465079]">{submission.project}</p>
                              <p className="text-xs text-[#465079]">{submission.date}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-[#232020]">{submission.hours}h</span>
                              {getStatusBadge(submission.status)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Recent Expenses */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-[#232020]">Recent Expense Submissions</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentSubmissions
                        .filter(sub => sub.type === 'expense')
                        .slice(0, 5)
                        .map((submission) => (
                          <div key={submission.id} className="flex items-center justify-between p-4 bg-[#e5ddd8] rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-[#232020]">{submission.user}</p>
                              <p className="text-sm text-[#465079]">{submission.project}</p>
                              <p className="text-xs text-[#465079]">{submission.date}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-[#232020]">${submission.amount}</span>
                              {getStatusBadge(submission.status)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other sections */}
          {activeSection === 'users' && <EmployeeManagement />}
          {activeSection === 'clients' && <ClientsAndProjects />}
          {activeSection === 'pending' && <PendingApprovals />}
          {activeSection === 'reports' && <SystemReports />}
          {activeSection === 'timesheets' && <AdminTimesheetManagement />}
          {activeSection === 'expenses' && <AdminExpenseManagement />}
          {activeSection === 'settings' && <AdminSettings />}

          
          {/* Other sections placeholder */}
          {!['dashboard', 'users', 'clients', 'pending', 'reports', 'timesheets', 'expenses', 'settings'].includes(activeSection) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-2xl font-semibold text-[#232020] mb-2">
                {navigationItems.find(item => item.id === activeSection)?.label}
              </div>
              <p className="text-[#465079]">
                This section is under development. Check back soon for full functionality.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
