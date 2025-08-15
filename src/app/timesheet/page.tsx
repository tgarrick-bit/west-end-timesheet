'use client';

import React, { useState } from 'react';

interface TimeEntry {
  id: string;
  day: string;
  project: string;
  hours: number;
  description: string;
}

export default function WeeklyTimesheet() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date('2025-08-11'));
  const [newEntry, setNewEntry] = useState({
    day: '',
    project: '',
    hours: '',
    description: ''
  });

  const projects = [
    'Metro Hospital - Nursing Staff',
    'Downtown Office - Security',  
    'City Schools - Substitute Teachers',
    'Riverside Manufacturing - Assembly Line',
    'Tech Consulting - Software Development'
  ];
  
  // Generate week dates based on current week
  const getWeekDates = (startDate: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeek);
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return `Week of ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    if (direction === 'prev') {
      newDate.setDate(currentWeek.getDate() - 7);
    } else {
      newDate.setDate(currentWeek.getDate() + 7);
    }
    setCurrentWeek(newDate);
  };

  const handleAddTimeEntry = () => {
    setShowModal(true);
  };

  const handleSave = () => {
    if (newEntry.day && newEntry.project && newEntry.hours && newEntry.description) {
      const entry: TimeEntry = {
        id: Date.now().toString(),
        day: newEntry.day,
        project: newEntry.project,
        hours: parseFloat(newEntry.hours),
        description: newEntry.description
      };
      setTimeEntries([...timeEntries, entry]);
      setNewEntry({ day: '', project: '', hours: '', description: '' });
      setShowModal(false);
    }
  };

  const getTotalHours = () => {
    return timeEntries.reduce((total, entry) => total + entry.hours, 0).toFixed(2);
  };

  const getEntriesForDay = (day: string) => {
    return timeEntries.filter(entry => entry.day === day);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-[#e31c79] text-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Weekly Timesheet</h1>
            <p className="text-lg mt-2">{formatWeekRange(currentWeek)}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Total Hours: {getTotalHours()}</div>
          </div>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex justify-center items-center mb-8">
        <button 
          onClick={() => navigateWeek('prev')}
          className="bg-white p-3 rounded-lg shadow-md hover:bg-gray-50 mr-4 transition-colors"
        >
          <span className="text-2xl">‹</span>
        </button>
        <span className="text-xl font-semibold text-gray-700">{formatWeekRange(currentWeek)}</span>
        <button 
          onClick={() => navigateWeek('next')}
          className="bg-white p-3 rounded-lg shadow-md hover:bg-gray-50 ml-4 transition-colors"
        >
          <span className="text-2xl">›</span>
        </button>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-7 gap-4 mb-8">
        {days.map((day, index) => (
          <div key={day} className="bg-white rounded-lg shadow-md p-4 min-h-[200px] hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">
              {day.slice(0, 3)} {formatDate(weekDates[index])}
            </h3>
            <div className="space-y-2">
              {getEntriesForDay(day).map(entry => (
                <div key={entry.id} className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                  <div className="text-sm font-medium text-blue-800">{entry.project}</div>
                  <div className="text-xs text-blue-600">{entry.hours}h</div>
                  <div className="text-xs text-gray-600 truncate">{entry.description}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Time Entry Button */}
      <div className="text-center">
        <button
          onClick={handleAddTimeEntry}
          className="bg-[#e31c79] text-white px-8 py-3 rounded-lg shadow-md hover:bg-pink-700 transition-colors text-lg font-semibold"
        >
          Add Time Entry
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Time Entry</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <select
                  value={newEntry.day}
                  onChange={(e) => setNewEntry({...newEntry, day: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a day</option>
                  {days.map((day, index) => (
                    <option key={day} value={day}>
                      {day} {formatDate(weekDates[index])}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <select
                  value={newEntry.project}
                  onChange={(e) => setNewEntry({...newEntry, project: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={newEntry.hours}
                  onChange={(e) => setNewEntry({...newEntry, hours: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Describe the work performed..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#e31c79] text-white rounded-md hover:bg-pink-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
