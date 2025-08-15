'use client'

import React, { useState } from 'react'

interface TimeEntry {
  id: string
  project: string
  task: string
  date: string
  hours: number
  notes: string
}

interface WeeklyTimesheetProps {
  userId?: string
}

export default function WeeklyTimesheet({ userId }: WeeklyTimesheetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [formData, setFormData] = useState({
    project: '',
    task: '',
    date: '',
    hours: 0,
    notes: ''
  })

  // Project options for the dropdown
  const projectOptions = [
    'Metro Hospital - Nursing Staff',
    'Downtown Office - Security',
    'City Schools - Substitute Teachers',
    'Riverside Manufacturing - Assembly Line',
    'Tech Consulting - Software Development'
  ]

  // Get week start (Monday) and end (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    return new Date(d.setDate(diff))
  }

  const getWeekEnd = (date: Date) => {
    const weekStart = getWeekStart(date)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return weekEnd
  }

  const weekStart = getWeekStart(currentWeek)
  const weekEnd = getWeekEnd(currentWeek)

  // Calculate total hours for the week
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0)

  // Week navigation handlers
  const goToPreviousWeek = () => {
    console.log('Going to previous week')
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() - 7)
    setCurrentWeek(newWeek)
  }

  const goToNextWeek = () => {
    console.log('Going to next week')
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + 7)
    setCurrentWeek(newWeek)
  }

  const goToCurrentWeek = () => {
    console.log('Going to current week')
    setCurrentWeek(new Date())
  }

  // Modal handlers
  const openModal = () => {
    console.log('Opening modal')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    console.log('Closing modal')
    setIsModalOpen(false)
    // Reset form data
    setFormData({
      project: '',
      task: '',
      date: '',
      hours: 0,
      notes: ''
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hours' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSave = () => {
    console.log('Saving time entry:', formData)
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      ...formData
    }
    setTimeEntries(prev => [...prev, newEntry])
    closeModal()
  }

  const handleCancel = () => {
    console.log('Canceling time entry')
    closeModal()
  }

  const handleDeleteEntry = (entryId: string) => {
    console.log('Deleting entry:', entryId)
    setTimeEntries(prev => prev.filter(entry => entry.id !== entryId))
  }

  const handleEditEntry = (entry: TimeEntry) => {
    console.log('Editing entry:', entry)
    setFormData({
      project: entry.project,
      task: entry.task,
      date: entry.date,
      hours: entry.hours,
      notes: entry.notes
    })
    setIsModalOpen(true)
  }

  const handleSubmitTimesheet = () => {
    console.log('Submitting timesheet for week:', weekStart.toDateString(), 'to', weekEnd.toDateString())
    console.log('Total entries:', timeEntries.length)
  }



  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  const generateWeekDays = () => {
    const days = []
    const start = new Date(weekStart)
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start)
      currentDate.setDate(start.getDate() + i)
      days.push(currentDate)
    }
    
    return days
  }

  const weekDays = generateWeekDays()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pink Header Bar */}
      <div className="bg-[#e31c79] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Weekly Timesheet</h1>
              <p className="text-pink-100 mt-1">
                {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
              <div className="text-pink-100 text-sm">Total Hours</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={openModal}
            className="bg-[#e31c79] hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            + Add Time Entry
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSubmitTimesheet}
              className="bg-[#05202E] hover:bg-[#0a2f3f] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Submit Timesheet
            </button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <button
            onClick={goToPreviousWeek}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center space-x-2"
          >
            <span className="text-lg">←</span>
            <span>Previous Week</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={goToCurrentWeek}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              Current Week
            </button>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">
                {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="text-sm text-gray-500">Week {Math.ceil((weekStart.getDate() + weekStart.getDay()) / 7)}</div>
            </div>
          </div>
          
          <button
            onClick={goToNextWeek}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center space-x-2"
          >
            <span>Next Week</span>
            <span className="text-lg">→</span>
          </button>
        </div>

        {/* Week Grid */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="grid grid-cols-8 gap-0">
            {/* Header row */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 font-semibold text-gray-700 border-r border-gray-200">
              <div className="text-center">Project/Task</div>
            </div>
            {weekDays.map((day, index) => (
              <div key={index} className="bg-gradient-to-b from-gray-50 to-white p-4 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
                <div className="text-lg text-gray-800">{getDayName(day)}</div>
                <div className="text-sm text-gray-500 mt-1">{formatDate(day)}</div>
              </div>
            ))}
          </div>

          {/* Time entries */}
          {timeEntries.length === 0 ? (
            <div className="p-12 text-center text-gray-500 bg-gray-50">
              <div className="text-6xl mb-4">📝</div>
              <div className="text-xl font-medium text-gray-600 mb-2">No time entries for this week</div>
              <div className="text-gray-500">Click &quot;Add Time Entry&quot; to get started</div>
            </div>
          ) : (
            timeEntries.map((entry) => (
              <div key={entry.id} className="grid grid-cols-8 gap-0 border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                <div className="p-4 border-r border-gray-200">
                  <div className="font-semibold text-gray-900 text-lg">{entry.project}</div>
                  <div className="text-gray-600 mt-1">{entry.task}</div>
                  <div className="flex space-x-3 mt-3">
                    <button
                      onClick={() => handleEditEntry(entry)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                {weekDays.map((day) => {
                  const isEntryDay = entry.date === day.toISOString().split('T')[0]
                  return (
                    <div key={day.toISOString()} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                      {isEntryDay ? (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="text-lg font-bold text-blue-800">{entry.hours}h</div>
                          {entry.notes && (
                            <div className="text-xs text-blue-600 mt-1 truncate" title={entry.notes}>
                              {entry.notes}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-300 text-lg">-</div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>



        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 w-full max-w-lg mx-4 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Time Entry</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project
                  </label>
                  <select
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a project</option>
                    {projectOptions.map((project, index) => (
                      <option key={index} value={project}>
                        {project}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Task
                  </label>
                  <input
                    type="text"
                    name="task"
                    value={formData.task}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent transition-all duration-200"
                    placeholder="Enter task description"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hours
                    </label>
                    <input
                      type="number"
                      name="hours"
                      value={formData.hours}
                      onChange={handleInputChange}
                      step="0.25"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent transition-all duration-200"
                      placeholder="0.0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent transition-all duration-200"
                    placeholder="Optional notes about the work"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-[#e31c79] hover:bg-pink-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}