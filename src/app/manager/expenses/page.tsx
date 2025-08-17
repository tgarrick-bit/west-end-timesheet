'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  DollarSign, 
  User, 
  Receipt, 
  ArrowRight,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react'

interface PendingExpense {
  id: string
  employeeId: string
  employeeName: string
  role: string
  date: string
  description: string
  amount: number
  project: string
  receiptUrl?: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function ManagerExpensesPage() {
  const router = useRouter()
  const { appUser } = useAuth()
  const [expenses, setExpenses] = useState<PendingExpense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading expense data
    setTimeout(() => {
      const mockExpenses: PendingExpense[] = [
        {
          id: 'exp1',
          employeeId: 'emp2',
          employeeName: 'Sarah Johnson',
          role: 'Software Development',
          date: '2025-01-15',
          description: 'Office Supplies - Developer tools and software licenses',
          amount: 89.50,
          project: 'ABC Corp - Software Development',
          receiptUrl: '/receipt1.pdf',
          status: 'pending'
        },
        {
          id: 'exp2',
          employeeId: 'emp2',
          employeeName: 'Sarah Johnson',
          role: 'Software Development',
          date: '2025-01-17',
          description: 'Client Lunch - Working lunch with client stakeholders',
          amount: 156.30,
          project: 'ABC Corp - Software Development',
          receiptUrl: '/receipt2.pdf',
          status: 'pending'
        },
        {
          id: 'exp3',
          employeeId: 'emp3',
          employeeName: 'David Kim',
          role: 'Data Analysis',
          date: '2025-01-16',
          description: 'Software License - Data analysis tools subscription',
          amount: 156.30,
          project: 'ABC Corp - Data Analysis',
          receiptUrl: '/receipt3.pdf',
          status: 'pending'
        }
      ]
      setExpenses(mockExpenses)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleReview = (expense: PendingExpense) => {
    router.push(`/manager/approvals?employee=${expense.employeeId}&type=expense`)
  }

  const handleQuickApprove = (expense: PendingExpense) => {
    // Handle quick approval
    console.log(`Quick approving expense ${expense.id}`)
    alert('Expense approved successfully!')
  }

  const handleQuickReject = (expense: PendingExpense) => {
    // Handle quick rejection
    console.log(`Quick rejecting expense ${expense.id}`)
    alert('Expense rejected. Please provide feedback.')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e31c79] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Pending Expenses...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#05202E] mb-2">Pending Expenses</h1>
        <p className="text-gray-600">
          Review and approve expense reports from your contractors.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-[#05202E]">{expenses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#e31c79] bg-opacity-10 rounded-lg">
              <User className="w-6 h-6 text-[#e31c79]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-[#05202E]">
                ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Receipt className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">With Receipts</p>
              <p className="text-2xl font-bold text-[#05202E]">
                {expenses.filter(exp => exp.receiptUrl).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#05202E]">Expenses Requiring Approval</h2>
        </div>
        
        {expenses.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <div key={expense.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#e31c79] bg-opacity-10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[#e31c79]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#05202E]">{expense.employeeName}</h3>
                        <p className="text-sm text-gray-600">{expense.role}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <span>{expense.project}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-[#05202E]">{expense.description}</span>
                      </div>
                      {expense.receiptUrl && (
                        <div className="text-sm text-blue-600">
                          📎 Receipt Available
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#e31c79]">${expense.amount.toFixed(2)}</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleQuickApprove(expense)}
                        className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleQuickReject(expense)}
                        className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleReview(expense)}
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
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No pending expenses to review</p>
            <p className="text-gray-400 text-sm">All expenses are up to date!</p>
          </div>
        )}
      </div>
    </div>
  )
}
