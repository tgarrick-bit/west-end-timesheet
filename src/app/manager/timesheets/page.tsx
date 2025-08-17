'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Clock, 
  User, 
  Building, 
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

interface PendingTimesheet {
  id: string
  employeeId: string
  employeeName: string
  role: string
  weekStart: string
  weekEnd: string
  totalHours: number
  yourHours: number
  otherHours: number
  hourlyRate: number
  status: 'pending' | 'approved' | 'rejected'
}

export default function ManagerTimesheetsPage() {
  const router = useRouter()
  const { appUser } = useAuth()
  const [timesheets, setTimesheets] = useState<PendingTimesheet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading timesheet data
    setTimeout(() => {
      const mockTimesheets: PendingTimesheet[] = [
        {
          id: 'ts1',
          employeeId: 'emp1',
          employeeName: 'Mike Chen',
          role: 'Tech Infrastructure',
          weekStart: '2025-01-13',
          weekEnd: '2025-01-19',
          totalHours: 40.0,
          yourHours: 26.0,
          otherHours: 14.0,
          hourlyRate: 95,
          status: 'pending'
        },
        {
          id: 'ts2',
          employeeId: 'emp2',
          employeeName: 'Sarah Johnson',
          role: 'Software Development',
          weekStart: '2025-01-13',
          weekEnd: '2025-01-19',
          totalHours: 37.5,
          yourHours: 37.5,
          otherHours: 0.0,
          hourlyRate: 110,
          status: 'pending'
        },
        {
          id: 'ts3',
          employeeId: 'emp3',
          employeeName: 'David Kim',
          role: 'Data Analysis',
          weekStart: '2025-01-13',
          weekEnd: '2025-01-19',
          totalHours: 35.0,
          yourHours: 22.0,
          otherHours: 13.0,
          hourlyRate: 85,
          status: 'pending'
        }
      ]
      setTimesheets(mockTimesheets)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleReview = (timesheet: PendingTimesheet) => {
    router.push(`/manager/approvals?employee=${timesheet.employeeId}&type=timesheet`)
  }

  const handleQuickApprove = (timesheet: PendingTimesheet) => {
    // Handle quick approval
    console.log(`Quick approving timesheet ${timesheet.id}`)
    alert('Timesheet approved successfully!')
  }

  const handleQuickReject = (timesheet: PendingTimesheet) => {
    // Handle quick rejection
    console.log(`Quick rejecting timesheet ${timesheet.id}`)
    alert('Timesheet rejected. Please provide feedback.')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e31c79] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Pending Timesheets...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#05202E] mb-2">Pending Timesheets</h1>
        <p className="text-gray-600">
          Review and approve timesheets from your contractors for the current week.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-[#05202E]">{timesheets.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#e31c79] bg-opacity-10 rounded-lg">
              <User className="w-6 h-6 text-[#e31c79]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-[#05202E]">
                {timesheets.reduce((sum, ts) => sum + ts.yourHours, 0)} hrs
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-[#05202E]">
                ${timesheets.reduce((sum, ts) => sum + (ts.yourHours * ts.hourlyRate), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timesheets List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#05202E]">Timesheets Requiring Approval</h2>
        </div>
        
        {timesheets.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {timesheets.map((timesheet) => (
              <div key={timesheet.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#e31c79] bg-opacity-10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[#e31c79]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#05202E]">{timesheet.employeeName}</h3>
                        <p className="text-sm text-gray-600">{timesheet.role}</p>
                        <p className="text-sm text-gray-600">
                          Week: {new Date(timesheet.weekStart).toLocaleDateString()} - {new Date(timesheet.weekEnd).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-[#e31c79]">{timesheet.yourHours} hrs</span> for your projects
                      </div>
                      <div className="text-sm text-gray-600">
                        {timesheet.otherHours > 0 && `${timesheet.otherHours} hrs for other projects`}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total: {timesheet.totalHours} hrs @ ${timesheet.hourlyRate}/hr
                      </div>
                      <div className="text-sm font-medium text-[#05202E]">
                        Amount: ${(timesheet.yourHours * timesheet.hourlyRate).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleQuickApprove(timesheet)}
                        className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleQuickReject(timesheet)}
                        className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleReview(timesheet)}
                        className="bg-[#e31c79] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#c41a6b] transition-colors flex items-center space-x-1"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Review</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No pending timesheets to review</p>
            <p className="text-gray-400 text-sm">All timesheets are up to date!</p>
          </div>
        )}
      </div>
    </div>
  )
}
