'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react'
import { Client } from '@/types'
import { supabase } from '@/lib/supabase'

interface ClientFormData {
  name: string
  contact_person: string
  contact_email: string
  contact_phone: string
  address: string
  time_tracking_method: 'detailed' | 'simple'
  billing_details: string
  is_active: boolean
}

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    time_tracking_method: 'detailed',
    billing_details: '',
    is_active: true
  })

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching clients from database...')
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name')

      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }
      
      console.log('✅ Clients fetched successfully:', data?.length || 0, 'clients')
      setClients(data || [])
    } catch (error) {
      console.error('❌ Error fetching clients:', error)
      // Set empty array to prevent infinite loading
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingClient) {
        // Update existing client
        const { error } = await supabase
          .from('clients')
          .update({
            name: formData.name,
            contact_person: formData.contact_person,
            contact_email: formData.contact_email,
            contact_phone: formData.contact_phone,
            address: formData.address,
            time_tracking_method: formData.time_tracking_method,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingClient.id)

        if (error) throw error
      } else {
        // Create new client
        const { error } = await supabase
          .from('clients')
          .insert([{
            name: formData.name,
            contact_person: formData.contact_person,
            contact_email: formData.contact_email,
            contact_phone: formData.contact_phone,
            address: formData.address,
            time_tracking_method: formData.time_tracking_method,
            is_active: formData.is_active
          }])

        if (error) throw error
      }

      // Reset form and refresh data
      resetForm()
      fetchClients()
    } catch (error) {
      console.error('Error saving client:', error)
    }
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      contact_person: client.contact_person || '',
      contact_email: client.contact_email,
      contact_phone: client.contact_phone || '',
      address: client.address || '',
      time_tracking_method: client.time_tracking_method,
      billing_details: '',
      is_active: client.is_active
    })
    setShowForm(true)
  }

  const handleDelete = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)

      if (error) throw error
      fetchClients()
    } catch (error) {
      console.error('Error deleting client:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      contact_person: '',
      contact_email: '',
      contact_phone: '',
      address: '',
      time_tracking_method: 'detailed',
      billing_details: '',
      is_active: true
    })
    setEditingClient(null)
    setShowForm(false)
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && client.is_active) ||
                         (statusFilter === 'inactive' && !client.is_active)
    
    return matchesSearch && matchesStatus
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
          <h2 className="text-2xl font-bold text-[#232020]">Client Management</h2>
          <p className="text-[#465079]">Manage your client relationships and information</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-[#e31c79] text-white rounded-lg hover:bg-[#d4156a] transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Client
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Client Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#232020]">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#232020] mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#232020] mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#232020] mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#232020] mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#232020] mb-2">
                  Time Tracking Method
                </label>
                <select
                  value={formData.time_tracking_method}
                  onChange={(e) => setFormData({ ...formData, time_tracking_method: e.target.value as 'detailed' | 'simple' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
                >
                  <option value="detailed">Detailed (Tasks & Categories)</option>
                  <option value="simple">Simple (Hours Only)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#232020] mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#232020] mb-2">
                Billing Details
              </label>
              <textarea
                value={formData.billing_details}
                onChange={(e) => setFormData({ ...formData, billing_details: e.target.value })}
                rows={3}
                placeholder="Payment terms, billing address, tax information..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-[#e31c79] focus:ring-[#e31c79] border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-[#232020]">
                Client is active
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-[#465079] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#e31c79] text-white rounded-lg hover:bg-[#d4156a] transition-colors"
              >
                {editingClient ? 'Update Client' : 'Create Client'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clients List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#232020]">
            Clients ({filteredClients.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredClients.length === 0 ? (
            <div className="px-6 py-8 text-center text-[#465079]">
              {clients.length === 0 ? 'No clients found. Create your first client to get started.' : 'No clients match your search criteria.'}
            </div>
          ) : (
            filteredClients.map((client) => (
              <div key={client.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-[#e5ddd8] rounded-lg">
                      <Building2 className="h-6 w-6 text-[#465079]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#232020]">{client.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-[#465079]">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {client.contact_email}
                        </span>
                        {client.contact_phone && (
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {client.contact_phone}
                          </span>
                        )}
                        {client.address && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {client.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.is_active ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {client.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleEdit(client)}
                      className="p-2 text-gray-400 hover:text-[#e31c79] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
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
