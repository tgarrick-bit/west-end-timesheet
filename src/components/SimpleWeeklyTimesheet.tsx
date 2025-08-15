'use client'

import { useState, useEffect } from 'react'

interface TimeEntry {
  id: string
  day: string
  project: string
  hours: number
  description: string
}

interface Project {
  id: string
  name: string
}

export default function SimpleWeeklyTimesheet() {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState({
    day: '',
    project: '',
    hours: 0,
    description: ''
  })
  
  // Mock projects - in real app, these would come from props or API
  const projects: Project[] = [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Mobile App Development' },
    { id: '3', name: 'Database Migration' },
    { id: '4', name: 'UI/UX Consultation' }
  ]

  // Generate current week dates
  useEffect(() => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday
    
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date)
    }
    
    setCurrentWeek(weekDates)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  const getWeekRange = () => {
    if (currentWeek.length === 0) return ''
    const start = currentWeek[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const end = currentWeek[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return `${start} - ${end}`
  }

  const handleAddEntry = () => {
    if (!modalData.day || !modalData.project || modalData.hours <= 0) {
      alert('Please fill in all required fields')
      return
    }

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      ...modalData
    }

    setTimeEntries([...timeEntries, newEntry])
    setModalData({ day: '', project: '', hours: 0, description: '' })
    setShowModal(false)
  }

  const getEntriesForDay = (dayName: string) => {
    return timeEntries.filter(entry => entry.day === dayName)
  }

  const getTotalHoursForDay = (dayName: string) => {
    const dayEntries = getEntriesForDay(dayName)
    return dayEntries.reduce((total, entry) => total + entry.hours, 0)
  }

  const getTotalHoursForWeek = () => {
    return timeEntries.reduce((total, entry) => total + entry.hours, 0)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Timesheet</h1>
        <p className="text-lg text-gray-600">{getWeekRange()}</p>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-4 mb-8">
        {currentWeek.map((date, index) => {
          const dayName = getDayName(date)
          const dayEntries = getEntriesForDay(dayName)
          const totalHours = getTotalHoursForDay(dayName)
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="text-center mb-3">
                <div className="font-semibold text-gray-800">{dayName}</div>
                <div className="text-sm text-gray-600">{formatDate(date)}</div>
                <div className="text-lg font-bold text-blue-600 mt-1">{totalHours}h</div>
              </div>
              
              <div className="space-y-2">
                {dayEntries.map(entry => (
                  <div key={entry.id} className="text-xs bg-gray-50 p-2 rounded">
                    <div className="font-medium text-gray-700">{entry.project}</div>
                    <div className="text-gray-600">{entry.hours}h</div>
                    {entry.description && (
                      <div className="text-gray-500 truncate">{entry.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary and Actions */}
      <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4 mb-6">
        <div className="text-lg font-semibold text-gray-800">
          Total Hours: <span className="text-blue-600">{getTotalHoursForWeek()}</span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Add Time Entry
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Add Time Entry</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day *
                </label>
                <select
                  value={modalData.day}
                  onChange={(e) => setModalData({...modalData, day: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a day</option>
                  {currentWeek.map((date, index) => (
                    <option key={index} value={getDayName(date)}>
                      {getDayName(date)} - {formatDate(date)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project *
                </label>
                <select
                  value={modalData.project}
                  onChange={(e) => setModalData({...modalData, project: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours *
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={modalData.hours}
                  onChange={(e) => setModalData({...modalData, hours: parseFloat(e.target.value) || 0})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={modalData.description}
                  onChange={(e) => setModalData({...modalData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Optional description of work done..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEntry}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
