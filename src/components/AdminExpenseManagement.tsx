'use client'

import { useState, useEffect } from 'react'
import { 
  Receipt, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  User,
  Building2,
  DollarSign,
  Download,
  RefreshCw
} from 'lucide-react'

export default function AdminExpenseManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#232020]">Expense Management</h2>
          <p className="text-[#465079]">Monitor and manage employee expense reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {/* Refresh functionality */}}
            className="flex items-center px-4 py-2 bg-gray-100 text-[#465079] rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => {/* Export functionality */}}
            className="flex items-center px-4 py-2 bg-[#e31c79] text-white rounded-lg hover:bg-[#d4156a] transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="p-4 bg-[#e5ddd8] rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Receipt className="h-8 w-8 text-[#465079]" />
          </div>
          <h2 className="text-2xl font-semibold text-[#232020] mb-2">Expense Management</h2>
          <p className="text-[#465079]">
            This section is under development. Check back soon for full expense management functionality.
          </p>
        </div>
      </div>
    </div>
  )
}
