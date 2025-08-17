'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  BarChart3, 
  Download, 
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  FileText,
  Eye
} from 'lucide-react'

interface ReportData {
  id: string
  name: string
  type: 'weekly' | 'monthly' | 'quarterly'
  period: string
  totalHours: number
  totalAmount: number
  contractorCount: number
  status: 'generated' | 'pending'
  generatedAt?: string
}

export default function ManagerReportsPage() {
  const router = useRouter()
  const { appUser } = useAuth()
  const [reports, setReports] = useState<ReportData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('current-week')

  useEffect(() => {
    // Simulate loading report data
    setTimeout(() => {
      const mockReports: ReportData[] = [
        {
          id: 'r1',
          name: 'Weekly Summary Report',
          type: 'weekly',
          period: 'Jan 13-19, 2025',
          totalHours: 125.5,
          totalAmount: 12475.50,
          contractorCount: 4,
          status: 'generated',
          generatedAt: '2025-01-19T18:00:00Z'
        },
        {
          id: 'r2',
          name: 'Monthly Cost Report',
          type: 'monthly',
          period: 'January 2025',
          totalHours: 502.0,
          totalAmount: 49850.00,
          contractorCount: 4,
          status: 'generated',
          generatedAt: '2025-01-31T18:00:00Z'
        },
        {
          id: 'r3',
          name: 'Contractor Performance Report',
          type: 'quarterly',
          period: 'Q4 2024',
          totalHours: 1480.5,
          totalAmount: 147250.00,
          contractorCount: 4,
          status: 'generated',
          generatedAt: '2024-12-31T18:00:00Z'
        }
      ]
      setReports(mockReports)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleGenerateReport = (type: string) => {
    // Handle report generation
    console.log(`Generating ${type} report`)
    alert(`${type} report is being generated. You will receive a notification when it's ready.`)
  }

  const handleDownloadReport = (report: ReportData) => {
    // Handle report download
    console.log(`Downloading report ${report.id}`)
    alert(`Downloading ${report.name}...`)
  }

  const handleViewReport = (report: ReportData) => {
    // Handle report viewing
    console.log(`Viewing report ${report.id}`)
    alert(`Opening ${report.name}...`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e31c79] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#05202E] mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">
          Generate and view comprehensive reports for your contractor activities and costs.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#e31c79] bg-opacity-10 rounded-lg">
              <Users className="w-6 h-6 text-[#e31c79]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Contractors</p>
              <p className="text-2xl font-bold text-[#05202E]">4</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week Hours</p>
              <p className="text-2xl font-bold text-[#05202E]">125.5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week Cost</p>
              <p className="text-2xl font-bold text-[#05202E]">$12,475</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Rate</p>
              <p className="text-2xl font-bold text-[#05202E]">$99/hr</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#05202E] mb-4">Generate New Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Calendar className="w-5 h-5 text-[#e31c79]" />
              <h3 className="font-medium text-[#05202E]">Weekly Summary</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Comprehensive weekly overview of hours, costs, and contractor activities.
            </p>
            <button
              onClick={() => handleGenerateReport('weekly')}
              className="w-full bg-[#e31c79] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#c41a6b] transition-colors"
            >
              Generate Weekly Report
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <DollarSign className="w-5 h-5 text-[#e31c79]" />
              <h3 className="font-medium text-[#05202E]">Cost Analysis</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Detailed cost breakdown by project, contractor, and expense category.
            </p>
            <button
              onClick={() => handleGenerateReport('cost')}
              className="w-full bg-[#05202E] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0a2f3f] transition-colors"
            >
              Generate Cost Report
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="w-5 h-5 text-[#e31c79]" />
              <h3 className="font-medium text-[#05202E]">Contractor Performance</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Individual contractor performance metrics and productivity analysis.
            </p>
            <button
              onClick={() => handleGenerateReport('performance')}
              className="w-full bg-[#E5DDD8] text-[#05202E] px-4 py-2 rounded-lg font-medium hover:bg-[#d4cac3] transition-colors"
            >
              Generate Performance Report
            </button>
          </div>
        </div>
      </div>

      {/* Existing Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#05202E]">Available Reports</h2>
        </div>
        
        {reports.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div key={report.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#e31c79] bg-opacity-10 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-[#e31c79]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#05202E]">{report.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="capitalize">{report.type}</span>
                          <span>•</span>
                          <span>{report.period}</span>
                          <span>•</span>
                          <span>{report.contractorCount} contractors</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>Total Hours: {report.totalHours}</span>
                          <span>•</span>
                          <span>Total Amount: ${report.totalAmount.toLocaleString()}</span>
                          {report.generatedAt && (
                            <>
                              <span>•</span>
                              <span>Generated: {new Date(report.generatedAt).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewReport(report)}
                      className="bg-[#e31c79] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#c41a6b] transition-colors flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDownloadReport(report)}
                      className="bg-[#05202E] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#0a2f3f] transition-colors flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No reports available</p>
            <p className="text-gray-400 text-sm">Generate your first report to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
