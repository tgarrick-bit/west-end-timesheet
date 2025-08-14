'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
  Calendar, 
  Receipt, 
  CheckCircle, 
  AlertCircle, 
  History,
  Play,
  Square,
  Plus,
  FileText,
  DollarSign
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { User, TimeEntry, Timesheet, ExpenseItem } from '@/types'
import { LogOut } from 'lucide-react'

interface EmployeeDashboardProps {
  user: User
}

export default function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  const { signOut } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState<Date | null>(null)
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([])
  const [weeklyHours, setWeeklyHours] = useState(0)
  const [pendingApprovals, setPendingApprovals] = useState(0)
  const [recentSubmissions, setRecentSubmissions] = useState<Array<{
    id: string
    type: 'timesheet' | 'expense'
    date: string
    status: string
    hours?: number
    amount?: number
  }>>([])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Simulate fetching employee data
    fetchEmployeeData()
  }, [])

  const fetchEmployeeData = async () => {
    // Simulate API calls
    setTimeout(() => {
      setTodayEntries([
        {
          id: '1',
          user_id: user.id,
          project_id: '1',
          task_id: '1',
          date: new Date().toISOString().split('T')[0],
          start_time: '09:00',
          end_time: '12:00',
          total_hours: 180, // 3 hours in minutes
          notes: 'Frontend development',
          location: 'Office',
          is_submitted: false,
          is_approved: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      setWeeklyHours(32.5)
      setPendingApprovals(2)
      setRecentSubmissions([
        { id: '1', type: 'timesheet', date: '2024-01-15', status: 'pending', hours: 40 },
        { id: '2', type: 'expense', date: '2024-01-14', status: 'approved', amount: 45.50 }
      ])
    }, 1000)
  }

  const handleClockInOut = () => {
    if (isClockedIn) {
      setIsClockedIn(false)
      setClockInTime(null)
    } else {
      setIsClockedIn(true)
      setClockInTime(new Date())
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-[#232020]">Employee Dashboard</h1>
              <p className="text-[#465079]">Welcome back, {user.first_name} {user.last_name}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-[#232020]">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-[#465079]">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Clock In/Out Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#232020]">Time Tracking</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isClockedIn 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {isClockedIn ? 'Clocked In' : 'Clocked Out'}
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-mono text-[#232020] mb-2">
                  {isClockedIn && clockInTime 
                    ? formatTime(new Date(Date.now() - clockInTime.getTime()))
                    : '00:00:00'
                  }
                </div>
                <p className="text-[#465079]">
                  {isClockedIn && clockInTime 
                    ? `Since ${clockInTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}`
                    : 'Ready to start your day'
                  }
                </p>
              </div>

              <button
                onClick={handleClockInOut}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  isClockedIn
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-[#e31c79] hover:bg-[#d4156a] text-white'
                }`}
              >
                {isClockedIn ? (
                  <>
                    <Square className="inline-block w-5 h-5 mr-2" />
                    Clock Out
                  </>
                ) : (
                  <>
                    <Play className="inline-block w-5 h-5 mr-2" />
                    Clock In
                  </>
                )}
              </button>
            </div>

            {/* Quick Time Entry */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#232020]">Quick Time Entry</h2>
                <button className="p-2 text-[#e31c79] hover:bg-[#e31c79] hover:text-white rounded-lg transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {todayEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-[#e5ddd8] rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-[#232020]">Project Name</p>
                      <p className="text-sm text-[#465079]">{entry.notes}</p>
                      <p className="text-xs text-[#465079]">
                        {entry.start_time} - {entry.end_time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[#232020]">
                        {formatDuration(entry.total_hours)}
                      </p>
                      <p className="text-sm text-[#465079]">Today</p>
                    </div>
                  </div>
                ))}
                
                {todayEntries.length === 0 && (
                  <div className="text-center py-8 text-[#465079]">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No time entries for today</p>
                    <p className="text-sm">Click the + button to add your first entry</p>
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Timesheet */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#232020]">This Week&apos;s Timesheet</h2>
                <button className="px-4 py-2 bg-[#e31c79] text-white rounded-lg hover:bg-[#d4156a] transition-colors">
                  Submit Timesheet
                </button>
              </div>
              
              <div className="bg-[#e5ddd8] rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-[#232020] mb-1">
                  {weeklyHours}h
                </div>
                <p className="text-[#465079]">Total hours this week</p>
                <p className="text-sm text-[#465079] mt-1">
                  {40 - weeklyHours > 0 ? `${40 - weeklyHours}h remaining` : 'Weekly goal met!'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#232020] mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#465079]">This Week</span>
                  <span className="font-semibold text-[#232020]">{weeklyHours}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#465079]">Pending Approvals</span>
                  <span className="font-semibold text-[#232020]">{pendingApprovals}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#465079]">Submitted Today</span>
                  <span className="font-semibold text-[#232020]">{todayEntries.length}</span>
                </div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#232020] mb-4">Pending Approvals</h2>
              {pendingApprovals > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-medium text-[#232020]">Timesheet Review</p>
                      <p className="text-sm text-[#465079]">Week of Jan 15</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-medium text-[#232020]">Expense Review</p>
                      <p className="text-sm text-[#465079]">$89.99 - Jan 14</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-[#465079]">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p>All caught up!</p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#232020] mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center p-3 bg-[#e5ddd8] rounded-lg">
                    {submission.type === 'timesheet' ? (
                      <FileText className="w-5 h-5 text-[#465079] mr-3" />
                    ) : (
                      <DollarSign className="w-5 h-5 text-[#465079] mr-3" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-[#232020]">
                        {submission.type === 'timesheet' ? 'Timesheet' : 'Expense'}
                      </p>
                      <p className="text-sm text-[#465079]">
                        {submission.type === 'timesheet' 
                          ? `${submission.hours}h` 
                          : `$${submission.amount}`
                        } • {submission.date}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      submission.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : submission.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {submission.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#232020] mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-[#e5ddd8] hover:bg-[#d4c8c0] rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Plus className="w-5 h-5 text-[#465079] mr-3" />
                    <span className="font-medium text-[#232020]">Add Time Entry</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-[#e5ddd8] hover:bg-[#d4c8c0] rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Receipt className="w-5 h-5 text-[#465079] mr-3" />
                    <span className="font-medium text-[#232020]">Submit Expense</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-[#e5ddd8] hover:bg-[#d4c8c0] rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-[#465079] mr-3" />
                    <span className="font-medium text-[#232020]">View Calendar</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
