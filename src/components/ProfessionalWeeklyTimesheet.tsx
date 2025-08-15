'use client'

import { useState, useEffect } from 'react'
import { format, addWeeks, subWeeks, startOfWeek, addDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'

interface TimeEntry {
  id: string
  day: string
  project: string
  hours: number
  description: string
  date: Date
}

interface Project {
  id: string
  name: string
}

export default function ProfessionalWeeklyTimesheet() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }))
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
    { id: '1', name: 'Metro Hospital' },
    { id: '2', name: 'Downtown Office' },
    { id: '3', name: 'City Schools' },
    { id: '4', name: 'Public Library' },
    { id: '5', name: 'Community Center' }
  ]

  // Generate current week dates
  const currentWeek = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentWeekStart(subWeeks(currentWeekStart, 1))
    } else {
      setCurrentWeekStart(addWeeks(currentWeekStart, 1))
    }
  }

  const formatDate = (date: Date) => {
    return format(date, 'MMM d')
  }

  const getDayName = (date: Date) => {
    return format(date, 'EEE')
  }

  const getFullDayName = (date: Date) => {
    return format(date, 'EEEE MMM d')
  }

  const getWeekRange = () => {
    const start = format(currentWeekStart, 'MMM d')
    const end = format(addDays(currentWeekStart, 6), 'MMM d, yyyy')
    return `${start} - ${end}`
  }

  const getTotalHoursForWeek = () => {
    return timeEntries.reduce((total, entry) => total + entry.hours, 0)
  }

  const getEntriesForDay = (date: Date) => {
    const dayKey = format(date, 'yyyy-MM-dd')
    return timeEntries.filter(entry => format(entry.date, 'yyyy-MM-dd') === dayKey)
  }

  const getTotalHoursForDay = (date: Date) => {
    const dayEntries = getEntriesForDay(date)
    return dayEntries.reduce((total, entry) => total + entry.hours, 0)
  }

  const handleAddEntry = () => {
    if (!modalData.day || !modalData.project || modalData.hours <= 0) {
      alert('Please fill in all required fields')
      return
    }

    const selectedDate = currentWeek.find(date => getFullDayName(date) === modalData.day)
    if (!selectedDate) return

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      day: modalData.day,
      project: modalData.project,
      hours: modalData.hours,
      description: modalData.description,
      date: selectedDate
    }

    setTimeEntries([...timeEntries, newEntry])
    setModalData({ day: '', project: '', hours: 0, description: '' })
    setShowModal(false)
  }

  const handleDeleteEntry = (entryId: string) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== entryId))
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Pink Header Bar */}
      <div className="bg-[#e31c79] rounded-t-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold">Weekly Timesheet</h1>
            
            {/* Week Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-lg font-medium">{getWeekRange()}</span>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-medium">Total Hours: {getTotalHoursForWeek().toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* 7-Day Calendar Grid */}
      <div className="grid grid-cols-7 gap-4 p-6 bg-white rounded-b-lg shadow-lg">
        {currentWeek.map((date, index) => {
          const dayEntries = getEntriesForDay(date)
          const totalHours = getTotalHoursForDay(date)
          
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm min-h-[200px]">
              <div className="p-4 border-b border-gray-100">
                <div className="text-center">
                  <div className="font-semibold text-gray-800 text-lg">{getDayName(date)}</div>
                  <div className="text-sm text-gray-600">{formatDate(date)}</div>
                  <div className="text-lg font-bold text-[#e31c79] mt-2">{totalHours.toFixed(2)}h</div>
                </div>
              </div>
              
              <div className="p-3 space-y-2 min-h-[120px]">
                {dayEntries.map(entry => (
                  <div key={entry.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">{entry.project}</div>
                        <div className="text-gray-600 text-sm">{entry.hours}h</div>
                        {entry.description && (
                          <div className="text-gray-500 text-xs mt-1 line-clamp-2">{entry.description}</div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Time Entry Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#e31c79] hover:bg-[#c4186a] text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg flex items-center mx-auto space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Time Entry</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Add Time Entry</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day *
                </label>
                <select
                  value={modalData.day}
                  onChange={(e) => setModalData({...modalData, day: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e31c79] focus:border-transparent transition-colors"
                >
                  <option value="">Select a day</option>
                  {currentWeek.map((date, index) => (
                    <option key={index} value={getFullDayName(date)}>
                      {getFullDayName(date)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project *
                </label>
                <select
                  value={modalData.project}
                  onChange={(e) => setModalData({...modalData, project: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e31c79] focus:border-transparent transition-colors"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours *
                </label>
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={modalData.hours}
                  onChange={(e) => setModalData({...modalData, hours: parseFloat(e.target.value) || 0})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e31c79] focus:border-transparent transition-colors"
                  placeholder="0.25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={modalData.description}
                  onChange={(e) => setModalData({...modalData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e31c79] focus:border-transparent transition-colors resize-none"
                  rows={4}
                  placeholder="Optional description of work done..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEntry}
                className="bg-[#e31c79] hover:bg-[#c4186a] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
