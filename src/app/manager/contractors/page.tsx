'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Users, 
  User, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Eye,
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react'

interface ContractorData {
  id: string
  name: string
  role: string
  email: string
  phone?: string
  status: 'active' | 'inactive' | 'pending'
  hourlyRate: number
  totalHours: number
  totalAmount: number
  lastActive: string
  projects: string[]
  employeeId: string
}

export default function ManagerContractorsPage() {
  const router = useRouter()
  const { appUser } = useAuth()
  const [contractors, setContractors] = useState<ContractorData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Simulate loading contractor data
    setTimeout(() => {
      const mockContractors: ContractorData[] = [
        {
          id: '1',
          name: 'Mike Chen',
          role: 'Tech Infrastructure',
          email: 'mike.chen@techcorp.com',
          phone: '+1 (555) 123-4567',
          status: 'active',
          hourlyRate: 95,
          totalHours: 156.5,
          totalAmount: 14867.50,
          lastActive: '2025-01-19',
          projects: ['ABC Corp - Tech Infrastructure', 'ABC Corp - System Maintenance'],
          employeeId: 'emp1'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          role: 'Software Development',
          email: 'sarah.johnson@devcorp.com',
          phone: '+1 (555) 234-5678',
          status: 'active',
          hourlyRate: 110,
          totalHours: 142.0,
          totalAmount: 15620.00,
          lastActive: '2025-01-19',
          projects: ['ABC Corp - Software Development', 'ABC Corp - API Integration'],
          employeeId: 'emp2'
        },
        {
          id: '3',
          name: 'David Kim',
          role: 'Data Analysis',
          email: 'david.kim@datacorp.com',
          phone: '+1 (555) 345-6789',
          status: 'active',
          hourlyRate: 85,
          totalHours: 98.5,
          totalAmount: 8372.50,
          lastActive: '2025-01-18',
          projects: ['ABC Corp - Data Analysis', 'ABC Corp - Reporting System'],
          employeeId: 'emp3'
        },
        {
          id: '4',
          name: 'Lisa Wang',
          role: 'Project Management',
          email: 'lisa.wang@pmcorp.com',
          phone: '+1 (555) 456-7890',
          status: 'active',
          hourlyRate: 120,
          totalHours: 168.0,
          totalAmount: 20160.00,
          lastActive: '2025-01-19',
          projects: ['ABC Corp - Project Management', 'ABC Corp - Client Coordination'],
          employeeId: 'emp4'
        }
      ]
      setContractors(mockContractors)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleViewDetails = (contractor: ContractorData) => {
    router.push(`/manager/contractors/${contractor.employeeId}`)
  }

  const handleContact = (contractor: ContractorData, method: 'email' | 'phone') => {
    if (method === 'email') {
      window.open(`mailto:${contractor.email}`)
    } else if (method === 'phone' && contractor.phone) {
      window.open(`tel:${contractor.phone}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-gray-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredContractors = contractors.filter(contractor =>
    contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e31c79] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Contractors...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#05202E] mb-2">My Contractors</h1>
        <p className="text-gray-600">
          Manage and view all contractors assigned to your projects.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#e31c79] bg-opacity-10 rounded-lg">
              <Users className="w-6 h-6 text-[#e31c79]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Contractors</p>
              <p className="text-2xl font-bold text-[#05202E]">{contractors.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-[#05202E]">
                {contractors.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-[#05202E]">
                {contractors.reduce((sum, c) => sum + c.totalHours, 0).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-[#05202E]">
                ${contractors.reduce((sum, c) => sum + c.totalAmount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search contractors by name, role, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredContractors.length} of {contractors.length} contractors
          </div>
        </div>
      </div>

      {/* Contractors List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#05202E]">Contractor Directory</h2>
        </div>
        
        {filteredContractors.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredContractors.map((contractor) => (
              <div key={contractor.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#e31c79] bg-opacity-10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-[#e31c79]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-[#05202E]">{contractor.name}</h3>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(contractor.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contractor.status)}`}>
                              {contractor.status.charAt(0).toUpperCase() + contractor.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">Role:</span> {contractor.role}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">Rate:</span> ${contractor.hourlyRate}/hr
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">Total Hours:</span> {contractor.totalHours} hrs
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Total Amount:</span> ${contractor.totalAmount.toLocaleString()}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">Email:</span> {contractor.email}
                            </p>
                            {contractor.phone && (
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Phone:</span> {contractor.phone}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">Last Active:</span> {new Date(contractor.lastActive).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Projects:</span> {contractor.projects.length}
                            </p>
                          </div>
                        </div>
                        
                        {contractor.projects.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Current Projects:</p>
                            <div className="flex flex-wrap gap-2">
                              {contractor.projects.map((project, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-[#e31c79] bg-opacity-10 text-[#e31c79] text-xs rounded-full"
                                >
                                  {project}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-6">
                    <button
                      onClick={() => handleViewDetails(contractor)}
                      className="bg-[#e31c79] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#c41a6b] transition-colors flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleContact(contractor, 'email')}
                        className="bg-[#05202E] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#0a2f3f] transition-colors flex items-center space-x-1"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </button>
                      
                      {contractor.phone && (
                        <button
                          onClick={() => handleContact(contractor, 'phone')}
                          className="bg-[#E5DDD8] text-[#05202E] px-3 py-2 rounded-md text-sm font-medium hover:bg-[#d4cac3] transition-colors flex items-center space-x-1"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No contractors found matching your search' : 'No contractors available'}
            </p>
            <p className="text-gray-400 text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'Contact your administrator to add contractors'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
