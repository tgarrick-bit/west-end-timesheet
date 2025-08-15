'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Save,
  RefreshCw,
  Database,
  Shield,
  Bell,
  Palette
} from 'lucide-react'

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#232020]">System Settings</h2>
          <p className="text-[#465079]">Configure system preferences and security settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {/* Save settings */}}
            className="flex items-center px-4 py-2 bg-[#e31c79] text-white rounded-lg hover:bg-[#d4156a] transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="p-4 bg-[#e5ddd8] rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Settings className="h-8 w-8 text-[#465079]" />
          </div>
          <h2 className="text-2xl font-semibold text-[#232020] mb-2">System Settings</h2>
          <p className="text-[#465079]">
            This section is under development. Check back soon for full system configuration options.
          </p>
        </div>
      </div>
    </div>
  )
}
