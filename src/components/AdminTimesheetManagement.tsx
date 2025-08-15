'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
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
import { supabase } from '@/lib/supabase'

interface TimesheetEntry {
  id: string
  user_id: string
  project_id: string
  task_id: string
  date: string
  total_hours: number
  notes: string
  is_submitted: boolean
  is_approved: boolean
  approved_by: string | null
  approved_at: string | null
  created_at: string
  user: {
    first_name: string
    last_name: string
    email: string
  }
  project: {
    name: string
    client: {
      name: string
    }
  }
}

interface TimesheetStats {
  totalEntries: number
  pendingApprovals: number
  approvedEntries: number
  rejectedEntries: number
  totalHours: number
  totalValue: number
}

export default function AdminTimesheetManagement() {
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [dateFilter, setDateFilter] = useState('')
  const [stats, setStats] = useState<TimesheetStats>({
    totalEntries: 0,
    pendingApprovals: 0,
    approvedEntries: 0,
    rejectedEntries: 0,
    totalHours: 0,
    totalValue: 0
  })

  useEffect(() => {
    fetchTimesheets()
  }, [])

  const fetchTimesheets = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching timesheet data from database...')
      
      // Fetch timesheet entries with user and project info
      const { data: timesheetData, error: timesheetError } = await supabase
        .from('time_entries')
        .select(`
          *,
          user:users(first_name, last_name, email),
          project:projects(
            name,
            client:clients(name)
          )
        `)
        .order('date', { ascending: false })
      
      if (timesheetError) {
        console.error('❌ Error fetching timesheets:', timesheetError)
        throw timesheetError
      }
      
      console.log('✅ Timesheets fetched:', timesheetData?.length || 0)
      setTimesheets(timesheetData || [])
      
      // Calculate stats
      calculateStats(timesheetData || [])
    } catch (error) {
      console.error('❌ Error fetching timesheet data:', error)
      setTimesheets([])
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: TimesheetEntry[]) => {
    const totalEntries = data.length
    const pendingApprovals = data.filter(entry => entry.is_submitted && !entry.is_approved).length
    const approvedEntries = data.filter(entry => entry.is_approved).length
    const rejectedEntries = data.filter(entry => entry.is_submitted && !entry.is_approved && entry.approved_by).length
    const totalHours = data.reduce((sum, entry) => sum + (entry.total_hours / 60), 0) // Convert minutes to hours
    
    // For now, using a placeholder hourly rate - in real app, this would come from project assignments
    const avgHourlyRate = 25
    const totalValue = totalHours * avgHourlyRate

    setStats({
      totalEntries,
      pendingApprovals,
      approvedEntries,
      rejectedEntries,
      totalHours,
      totalValue
    })
  }

  const handleStatusChange = async (entryId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('time_entries')
        .update({ 
          is_approved: newStatus === 'approved',
          approved_by: 'admin', // This should be the actual admin user ID
          approved_at: new Date().toISOString()
        })
        .eq('id', entryId)

      if (error) throw error
      
      // Refresh data
      fetchTimesheets()
    } catch (error) {
      console.error('Error updating timesheet status:', error)
    }
  }

  const getStatusBadge = (entry: TimesheetEntry) => {
    if (entry.is_approved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </span>
      )
    } else if (entry.is_submitted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Draft
        </span>
      )
    }
  }

  const filteredTimesheets = timesheets.filter(entry => {
    const matchesSearch = 
      entry.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.project.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesStatus = true
    if (statusFilter === 'pending') {
      matchesStatus = entry.is_submitted && !entry.is_approved
    } else if (statusFilter === 'approved') {
      matchesStatus = entry.is_approved
    } else if (statusFilter === 'rejected') {
      matchesStatus = entry.is_submitted && !entry.is_approved && entry.approved_by
    }
    
    const matchesDate = !dateFilter || entry.date === dateFilter
    
    return matchesSearch && matchesStatus && matchesDate
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e31c79]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#232020]">Timesheet Management</h2>
          <p className="text-[#465079]">Monitor and manage employee timesheets across all projects</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchTimesheets}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#e31c79]">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#465079]">Total Entries</p>
              <p className="text-2xl font-semibold text-[#232020]">{stats.totalEntries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#465079]">Pending Approval</p>
              <p className="text-2xl font-semibold text-[#232020]">{stats.pendingApprovals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#465079]">Total Hours</p>
              <p className="text-2xl font-semibold text-[#232020]">{stats.totalHours.toFixed(1)}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#465079]">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#465079]">Total Value</p>
              <p className="text-2xl font-semibold text-[#232020]">${stats.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by employee name or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
        />
      </div>

      {/* Timesheets List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#232020]">
            Timesheet Entries ({filteredTimesheets.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTimesheets.length === 0 ? (
            <div className="px-6 py-8 text-center text-[#465079]">
              {timesheets.length === 0 ? 'No timesheet entries found.' : 'No entries match your search criteria.'}
            </div>
          ) : (
            filteredTimesheets.map((entry) => (
              <div key={entry.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-[#e5ddd8] rounded-lg">
                      <User className="h-6 w-6 text-[#465079]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#232020]">
                        {entry.user.first_name} {entry.user.last_name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-[#465079] mt-1">
                        <span className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {entry.project.client.name} - {entry.project.name}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {(entry.total_hours / 60).toFixed(1)}h
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(entry)}
                    {entry.is_submitted && !entry.is_approved && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(entry.id, 'approved')}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(entry.id, 'rejected')}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => {/* View details */}}
                      className="p-2 text-gray-400 hover:text-[#e31c79] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
