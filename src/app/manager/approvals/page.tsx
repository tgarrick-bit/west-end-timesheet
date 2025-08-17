'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Calendar,
  FileText,
  Receipt,
  MessageSquare,
  ArrowLeft,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  FileImage
} from 'lucide-react'

interface TimesheetEntry {
  date: string
  project: string
  hours: number
  isYourProject: boolean
  canApprove: boolean
  description?: string
  task?: string
}

interface ExpenseItem {
  id: string
  date: string
  description: string
  amount: number
  project: string
  isYourProject: boolean
  receiptUrl?: string
  status: 'pending' | 'approved' | 'rejected'
  category: string
  businessJustification?: string
}

interface EmployeeSubmission {
  id: string
  employeeId: string
  employeeName: string
  role: string
  weekStart: string
  weekEnd: string
  totalHours: number
  yourHours: number
  otherHours: number
  timesheetStatus: 'pending' | 'approved' | 'rejected'
  expenseStatus: 'pending' | 'approved' | 'rejected' | 'none'
  totalExpenses: number
  yourExpenses: number
  hourlyRate: number
  timesheetEntries: TimesheetEntry[]
  expenses: ExpenseItem[]
}

export default function ApprovalsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { appUser } = useAuth()
  const [employeeId, setEmployeeId] = useState<string>('')
  const [approvalType, setApprovalType] = useState<string>('')
  const [employeeData, setEmployeeData] = useState<EmployeeSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showExpenseDetails, setShowExpenseDetails] = useState(false)
  const [approvalComments, setApprovalComments] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null)

  useEffect(() => {
    const empId = searchParams.get('employee')
    const type = searchParams.get('type')
    
    if (empId) {
      setEmployeeId(empId)
      setApprovalType(type || 'timesheet')
      loadEmployeeData(empId)
    }
  }, [searchParams])

  const loadEmployeeData = async (empId: string) => {
    // Simulate loading employee data with both timesheet and expense data
    setTimeout(() => {
      const mockData: EmployeeSubmission = {
        id: '1',
        employeeId: empId,
        employeeName: 'Sarah Johnson',
        role: 'Software Development',
        weekStart: '2025-01-13',
        weekEnd: '2025-01-19',
        totalHours: 37.5,
        yourHours: 37.5,
        otherHours: 0.0,
        timesheetStatus: 'pending',
        expenseStatus: 'pending',
        totalExpenses: 245.80,
        yourExpenses: 245.80,
        hourlyRate: 110,
        timesheetEntries: [
          {
            date: '2025-01-13',
            project: 'ABC Corp - Software Development',
            hours: 7.5,
            isYourProject: true,
            canApprove: true,
            description: 'Feature development and testing',
            task: 'Development'
          },
          {
            date: '2025-01-14',
            project: 'ABC Corp - Software Development',
            hours: 8.0,
            isYourProject: true,
            canApprove: true,
            description: 'Code review and documentation',
            task: 'Development'
          },
          {
            date: '2025-01-15',
            project: 'ABC Corp - Software Development',
            hours: 7.5,
            isYourProject: true,
            canApprove: true,
            description: 'Bug fixes and optimization',
            task: 'Development'
          },
          {
            date: '2025-01-16',
            project: 'ABC Corp - Software Development',
            hours: 8.0,
            isYourProject: true,
            canApprove: true,
            description: 'Integration testing',
            task: 'Development'
          },
          {
            date: '2025-01-17',
            project: 'ABC Corp - Software Development',
            hours: 6.5,
            isYourProject: true,
            canApprove: true,
            description: 'Final testing and deployment prep',
            task: 'Development'
          }
        ],
        expenses: [
          {
            id: 'exp1',
            date: '2025-01-15',
            description: 'Developer tools and software licenses',
            amount: 89.50,
            project: 'ABC Corp - Software Development',
            isYourProject: true,
            receiptUrl: '/receipt1.jpg',
            status: 'pending',
            category: 'Software',
            businessJustification: 'Required development tools for project completion'
          },
          {
            id: 'exp2',
            date: '2025-01-17',
            description: 'Working lunch with client stakeholders',
            amount: 156.30,
            project: 'ABC Corp - Software Development',
            isYourProject: true,
            receiptUrl: '/receipt2.jpg',
            status: 'pending',
            category: 'Meals',
            businessJustification: 'Client meeting to discuss project requirements and feedback'
          }
        ]
      }

      setEmployeeData(mockData)
      setIsLoading(false)
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getDayEntries = (date: string) => {
    return employeeData?.timesheetEntries.filter(entry => entry.date === date) || []
  }

  const handleApproval = (type: 'timesheet' | 'expenses' | 'all') => {
    // Handle approval logic
    console.log(`Approving ${type} for employee ${employeeId}`)
    // In real app, this would make API call
  }

  const handleRejection = (type: 'timesheet' | 'expenses' | 'all') => {
    // Handle rejection logic
    console.log(`Rejecting ${type} for employee ${employeeId}`)
    // In real app, this would make API call
  }

  const handleExpenseApproval = (expenseId: string, action: 'approve' | 'reject') => {
    // Handle individual expense approval/rejection
    console.log(`${action} expense ${expenseId}`)
    // In real app, this would make API call
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e31c79] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading employee data...</p>
        </div>
      </div>
    )
  }

  if (!employeeData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Employee not found</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 bg-[#e31c79] text-white px-4 py-2 rounded-md hover:bg-[#c41a6b] transition-colors"
        >
          Go Back
        </button>
      </div>
    )
  }

  const weekDays = ['2025-01-13', '2025-01-14', '2025-01-15', '2025-01-16', '2025-01-17']

  return (
    <div className="space-y-6">
      {/* Header - EXACTLY matching Admin Dashboard */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Complete Review: {employeeData.employeeName}
              </h1>
              <p className="text-gray-600 mt-1">
                {employeeData.role} • Week of {formatDate(employeeData.weekStart)} - {formatDate(employeeData.weekEnd)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Employee ID</p>
            <p className="font-mono text-gray-900">{employeeData.employeeId}</p>
          </div>
        </div>
      </div>

      {/* Week Summary - EXACTLY matching Admin Dashboard style */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-500">Week Period</h3>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {formatDate(employeeData.weekStart)} - {formatDate(employeeData.weekEnd)}
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
            <p className="text-2xl font-bold text-[#e31c79] mt-1">
              {employeeData.totalHours} hrs
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-500">Your Projects</h3>
            <p className="text-lg font-semibold text-[#05202E] mt-1">
              {employeeData.yourHours} hrs
            </p>
            <p className="text-sm text-gray-500">
              ${(employeeData.yourHours * employeeData.hourlyRate).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-500">Pending Expenses</h3>
            <p className="text-lg font-semibold text-blue-600 mt-1">
              ${employeeData.yourExpenses.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              {employeeData.expenses.length} items
            </p>
          </div>
        </div>
      </div>

      {/* TIMESHEET SECTION */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-[#e31c79]" />
            Weekly Timesheet Review
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleApproval('timesheet')}
              className="bg-[#e31c79] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#c41a6b] transition-colors flex items-center"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve Timesheet
            </button>
            <button 
              onClick={() => handleRejection('timesheet')}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Reject Timesheet
            </button>
          </div>
        </div>

        {/* Timesheet Grid */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 gap-4 min-w-[800px]">
            {/* Header Row */}
            <div className="font-medium text-gray-700 text-center">Day</div>
            {weekDays.map(day => (
              <div key={day} className="font-medium text-gray-700 text-center">
                {formatDate(day)}
              </div>
            ))}

            {/* Your Projects Row */}
            <div className="font-medium text-gray-700 bg-pink-50 p-2 rounded text-center border border-pink-200">
              Your Projects
            </div>
            {weekDays.map(day => {
              const entries = getDayEntries(day).filter(entry => entry.isYourProject)
              const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0)
              return (
                <div key={day} className="bg-pink-50 p-2 rounded text-center border border-pink-200">
                  <div className="font-semibold text-[#e31c79]">{totalHours} hrs</div>
                  {entries.map((entry, idx) => (
                    <div key={idx} className="text-xs text-gray-600 mt-1">
                      {entry.project.split(' - ')[1]} ({entry.hours}h)
                    </div>
                  ))}
                </div>
              )
            })}

            {/* Other Projects Row */}
            <div className="font-medium text-gray-700 bg-gray-100 p-2 rounded text-center border border-gray-200">
              Other Projects
            </div>
            {weekDays.map(day => {
              const entries = getDayEntries(day).filter(entry => !entry.isYourProject)
              const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0)
              return (
                <div key={day} className="bg-gray-100 p-2 rounded text-center border border-gray-200">
                  <div className="font-semibold text-gray-600">{totalHours} hrs</div>
                  {entries.map((entry, idx) => (
                    <div key={idx} className="text-xs text-gray-500 mt-1">
                      {entry.project.split(' - ')[1]} ({entry.hours}h)
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* Project Breakdown */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Project Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-[#e31c79] mb-2">Your Projects (Billable to You)</h4>
              {Object.entries(
                employeeData.timesheetEntries
                  .filter(entry => entry.isYourProject)
                  .reduce((projects, entry) => {
                    const projectName = entry.project
                    if (!projects[projectName]) {
                      projects[projectName] = 0
                    }
                    projects[projectName] += entry.hours
                    return projects
                  }, {} as Record<string, number>)
              ).map(([project, hours]) => (
                <div key={project} className="flex justify-between text-sm">
                  <span className="text-gray-700">{project.split(' - ')[1]}</span>
                  <span className="font-medium">{hours} hrs</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-medium text-gray-600 mb-2">Other Client Work</h4>
              {Object.entries(
                employeeData.timesheetEntries
                  .filter(entry => !entry.isYourProject)
                  .reduce((projects, entry) => {
                    const projectName = entry.project
                    if (!projects[projectName]) {
                      projects[projectName] = 0
                    }
                    projects[projectName] += entry.hours
                    return projects
                  }, {} as Record<string, number>)
              ).map(([project, hours]) => (
                <div key={project} className="flex justify-between text-sm">
                  <span className="text-gray-500">{project.split(' - ')[1]}</span>
                  <span className="font-medium">{hours} hrs</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EXPENSES SECTION */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Receipt className="w-5 h-5 mr-2 text-blue-600" />
            Expense Review
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleApproval('expenses')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve All Expenses
            </button>
            <button 
              onClick={() => handleRejection('expenses')}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Reject All Expenses
            </button>
          </div>
        </div>

        {employeeData.expenses.length > 0 ? (
          <div className="space-y-4">
            {employeeData.expenses.map((expense) => (
              <div key={expense.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{expense.description}</h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(expense.date)} • {expense.category} • {expense.project.split(' - ')[1]}
                        </p>
                        {expense.businessJustification && (
                          <p className="text-sm text-gray-500 mt-1">
                            {expense.businessJustification}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">Amount</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {expense.receiptUrl && (
                        <button 
                          onClick={() => setSelectedExpense(expense)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Receipt"
                        >
                          <FileImage className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleExpenseApproval(expense.id, 'approve')}
                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleExpenseApproval(expense.id, 'reject')}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Receipt className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No expenses submitted for this week</p>
          </div>
        )}
      </div>

      {/* COMBINED APPROVAL ACTIONS */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Combined Approval Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Timesheet Actions */}
          <div className="p-4 border border-gray-200 rounded-lg bg-pink-50">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-[#e31c79]" />
              Timesheet Approval
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleApproval('timesheet')}
                className="w-full bg-[#e31c79] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#c41a6b] transition-colors"
              >
                ✅ Approve Timesheet ({employeeData.yourHours} hrs)
              </button>
              <button 
                onClick={() => handleRejection('timesheet')}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                ❌ Reject Timesheet
              </button>
            </div>
          </div>

          {/* Expense Actions */}
          <div className="p-4 border border-gray-200 rounded-lg bg-blue-50">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Receipt className="w-4 h-4 mr-2 text-blue-600" />
              Expense Approval
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleApproval('expenses')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                ✅ Approve Expenses (${employeeData.yourExpenses.toFixed(2)})
              </button>
              <button 
                onClick={() => handleRejection('expenses')}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                ❌ Reject Expenses
              </button>
            </div>
          </div>

          {/* Combined Actions */}
          <div className="p-4 border border-gray-200 rounded-lg bg-green-50">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Combined Actions
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleApproval('all')}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
              >
                ✅ Approve Everything
              </button>
              <button 
                onClick={() => handleRejection('all')}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                ❌ Reject Everything
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Approval Comments (Optional)
          </label>
          <textarea
            value={approvalComments}
            onChange={(e) => setApprovalComments(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
            placeholder="Add any comments or notes for this approval..."
          />
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Receipt for {selectedExpense.description}</h3>
              <button 
                onClick={() => setSelectedExpense(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center">
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <FileImage className="w-16 h-16 text-gray-400" />
                <p className="text-gray-500 ml-2">Receipt Image</p>
              </div>
              <p className="text-sm text-gray-600">
                Receipt for ${selectedExpense.amount.toFixed(2)} on {formatDate(selectedExpense.date)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

