'use client'

import { useState, useEffect } from 'react'

export default function TestClientDropdown() {
  const [clients, setClients] = useState<any[]>([])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [loading, setLoading] = useState(true)

  // Demo clients for testing
  const demoClients = [
    {
      id: 'demo-1',
      name: 'Metro Hospital - Nursing Staff',
      is_active: true
    },
    {
      id: 'demo-2',
      name: 'Downtown Office - Security',
      is_active: true
    },
    {
      id: 'demo-3',
      name: 'City Schools - Substitute Teachers',
      is_active: true
    }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setClients(demoClients)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Client Dropdown</h1>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e31c79]"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Client Dropdown</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#232020] mb-6">Project Creation Form</h2>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#232020] mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter project name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#232020] mb-2">
                  Client *
                </label>
                {/* Debug info */}
                <div className="text-xs text-gray-500 mb-1">
                  Available clients: {clients.length} | Active clients: {clients.filter(c => c.is_active).length}
                </div>
                <select
                  required
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
                >
                  <option value="">Select a client</option>
                  {clients.filter(c => c.is_active).map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-[#e31c79] text-white px-6 py-2 rounded-lg hover:bg-[#c41a6b] transition-colors"
              >
                Create Project
              </button>
            </div>
          </form>

          {/* Debug output */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <p>Selected Client ID: {selectedClientId || 'None'}</p>
            <p>Selected Client Name: {clients.find(c => c.id === selectedClientId)?.name || 'None'}</p>
            <p>Total Clients: {clients.length}</p>
            <p>Active Clients: {clients.filter(c => c.is_active).length}</p>
            <pre className="text-xs mt-2 bg-white p-2 rounded border">
              {JSON.stringify(clients, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
