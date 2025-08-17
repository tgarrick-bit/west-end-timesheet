'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  FileText,
  Receipt,
  User,
  Calendar,
  Building
} from 'lucide-react'

interface TimesheetEntry {
  date: string
  totalHours: number
  projectHours: { [key: string]: number }
  projects: string[]
}

interface ExpenseEntry {
  id: string
  date: string
  description: string
  amount: number
  project: string
  receipt?: string
  status: 'pending' | 'approved' | 'rejected'
}

interface EmployeeData {
  id: string
  name: string
  role: string
  hourlyRate: number
  timesheet: TimesheetEntry[]
  expenses: ExpenseEntry[]
}

export default function ApprovalsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [employee, setEmployee] = useState<EmployeeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'timesheet' | 'expenses' | 'both'>('both')

  const employeeId = searchParams.get('employee')
  const type = searchParams.get('type')

  useEffect(() => {
    if (employeeId) {
      // Simulate fetching employee data
      setTimeout(() => {
        const mockEmployee: EmployeeData = {
          id: employeeId,
          name: employeeId === 'emp1' ? 'Mike Chen' : 'Sarah Johnson',
          role: employeeId === 'emp1' ? 'Tech Infrastructure' : 'Software Development',
          hourlyRate: employeeId === 'emp1' ? 95 : 110,
          timesheet: [
            {
              date: '2025-01-13',
              totalHours: 8.0,
              projectHours: { 'ABC Corp': 5.0, 'Other Client': 3.0 },
              projects: ['ABC Corp', 'Other Client']
            },
            {
              date: '2025-01-14',
              totalHours: 7.5,
              projectHours: { 'ABC Corp': 4.0, 'Training': 3.5 },
              projects: ['ABC Corp', 'Training']
            },
            {
              date: '2025-01-15',
              totalHours: 8.0,
              projectHours: { 'ABC Corp': 6.0, 'Other Client': 2.0 },
              projects: ['ABC Corp', 'Other Client']
            },
            {
              date: '2025-01-16',
              totalHours: 8.0,
              projectHours: { 'ABC Corp': 6.0, 'Other Client': 2.0 },
              projects: ['ABC Corp', 'Other Client']
            },
            {
              date: '2025-01-17',
              totalHours: 8.0,
              projectHours: { 'ABC Corp': 5.0, 'Other Client': 3.0 },
              projects: ['ABC Corp', 'Other Client']
            }
          ],
          expenses: [
            {
              id: 'exp1',
              date: '2025-01-15',
              description: 'Office Supplies',
              amount: 89.50,
              project: 'ABC Corp - Software Development',
              status: 'pending'
            },
            {
              id: 'exp2',
              date: '2025-01-17',
              description: 'Client Lunch',
              amount: 156.30,
              project: 'ABC Corp - Software Development',
              status: 'pending'
            }
          ]
        }
        setEmployee(mockEmployee)
        setIsLoading(false)
      }, 1000)
    }
  }, [employeeId])

  const calculateYourHours = () => {
    if (!employee) return 0
    return employee.timesheet.reduce((total, day) => {
      return total + (day.projectHours['ABC Corp'] || 0)
    }, 0)
  }

  const calculateOtherHours = () => {
    if (!employee) return 0
    return employee.timesheet.reduce((total, day) => {
      return total + day.totalHours - (day.projectHours['ABC Corp'] || 0)
    }, 0)
  }

  const calculateTotalExpenses = () => {
    if (!employee) return 0
    return employee.expenses.reduce((total, exp) => total + exp.amount, 0)
  }

  const handleApproveAll = () => {
    // Handle approval logic
    console.log('Approving all timesheet and expenses')
  }

  const handleApproveTimesheetOnly = () => {
    // Handle timesheet only approval
    console.log('Approving timesheet only')
  }

  const handleApproveExpensesOnly = () => {
    // Handle expenses only approval
    console.log('Approving expenses only')
  }

  const handleRejectAll = () => {
    // Handle rejection logic
    console.log('Rejecting all')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e31c79] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Employee Review...</p>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Employee not found</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 bg-[#e31c79] text-white px-4 py-2 rounded-lg hover:bg-[#c41a6b] transition-colors"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-[#e31c79] hover:text-[#c41a6b] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contractors</span>
        </button>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-[#e31c79] bg-opacity-10 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-[#e31c79]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#05202E]">{employee.name}</h1>
            <p className="text-gray-600">{employee.role}</p>
            <p className="text-sm text-gray-500">Employee ID: {employee.id}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setSelectedTab('both')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'both' 
                ? 'bg-white text-[#e31c79] shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Review All
          </button>
          <button
            onClick={() => setSelectedTab('timesheet')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'timesheet' 
                ? 'bg-white text-[#e31c79] shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Timesheet Only
          </button>
          <button
            onClick={() => setSelectedTab('expenses')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'expenses' 
                ? 'bg-white text-[#e31c79] shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Expenses Only
          </button>
        </div>
      </div>

      {/* Timesheet Section */}
      {(selectedTab === 'both' || selectedTab === 'timesheet') && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#05202E] flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#e31c79]" />
              <span>Timesheet Review - Week of January 13-19, 2025</span>
            </h2>
          </div>
          
          <div className="p-6">
            {/* Weekly Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Your Hours</p>
                <p className="text-2xl font-bold text-blue-800">{calculateYourHours()} hrs</p>
                <p className="text-sm text-blue-600">@ ${employee.hourlyRate}/hr = ${(calculateYourHours() * employee.hourlyRate).toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">Other Client Hours</p>
                <p className="text-2xl font-bold text-gray-800">{calculateOtherHours()} hrs</p>
                <p className="text-sm text-gray-600">(Not your approval)</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Total Week Hours</p>
                <p className="text-2xl font-bold text-green-800">
                  {employee.timesheet.reduce((total, day) => total + day.totalHours, 0)} hrs
                </p>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Total Hours</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Your Projects</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Other Projects</th>
                  </tr>
                </thead>
                <tbody>
                  {employee.timesheet.map((day, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#05202E]">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-[#05202E]">{day.totalHours} hrs</span>
                      </td>
                      <td className="py-3 px-4">
                        {day.projects.map(project => 
                          project === 'ABC Corp' ? (
                            <div key={project} className="text-[#e31c79] font-medium">
                              {project}: {day.projectHours[project]} hrs
                            </div>
                          ) : null
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {day.projects.map(project => 
                          project !== 'ABC Corp' ? (
                            <div key={project} className="text-gray-500">
                              {project}: {day.projectHours[project]} hrs
                            </div>
                          ) : null
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Section */}
      {(selectedTab === 'both' || selectedTab === 'expenses') && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#05202E] flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-[#e31c79]" />
              <span>Expenses Review - Week of January 13-19, 2025</span>
            </h2>
          </div>
          
          <div className="p-6">
            {employee.expenses.length > 0 ? (
              <>
                <div className="mb-4">
                  <p className="text-lg font-medium text-[#05202E]">
                    Total Expenses: <span className="text-[#e31c79]">${calculateTotalExpenses().toFixed(2)}</span>
                  </p>
                </div>
                
                <div className="space-y-4">
                  {employee.expenses.map((expense) => (
                    <div key={expense.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Receipt className="w-5 h-5 text-[#e31c79]" />
                            <div>
                              <h3 className="font-medium text-[#05202E]">{expense.description}</h3>
                              <p className="text-sm text-gray-600">{expense.project}</p>
                              <p className="text-sm text-gray-500">
                                Date: {new Date(expense.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#e31c79]">${expense.amount.toFixed(2)}</p>
                          <div className="flex space-x-2 mt-2">
                            <button className="bg-[#e31c79] text-white px-3 py-1 rounded text-sm hover:bg-[#c41a6b] transition-colors">
                              Approve
                            </button>
                            <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No expenses for this week</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approval Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#05202E] mb-4">Approval Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleApproveAll}
            className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Approve All</span>
          </button>
          
          <button
            onClick={handleApproveTimesheetOnly}
            className="bg-[#e31c79] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#c41a6b] transition-colors flex items-center justify-center space-x-2"
          >
            <Clock className="w-5 h-5" />
            <span>Approve Timesheet</span>
          </button>
          
          <button
            onClick={handleApproveExpensesOnly}
            className="bg-[#05202E] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#0a2f3f] transition-colors flex items-center justify-center space-x-2"
          >
            <Receipt className="w-5 h-5" />
            <span>Approve Expenses</span>
          </button>
          
          <button
            onClick={handleRejectAll}
            className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <XCircle className="w-5 h-5" />
            <span>Reject All</span>
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-[#05202E] mb-2">Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Your Hours:</span>
              <span className="ml-2 font-medium text-[#05202E]">{calculateYourHours()} hrs</span>
            </div>
            <div>
              <span className="text-gray-600">Total Expenses:</span>
              <span className="ml-2 font-medium text-[#05202E]">${calculateTotalExpenses().toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Amount:</span>
              <span className="ml-2 font-medium text-[#e31c79]">
                ${(calculateYourHours() * employee.hourlyRate + calculateTotalExpenses()).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
