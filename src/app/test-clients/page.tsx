'use client'

import ClientManagement from '@/components/ClientManagement'

export default function TestClientsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#232020] mb-8">Client Management Test Page</h1>
        <ClientManagement />
      </div>
    </div>
  )
}
