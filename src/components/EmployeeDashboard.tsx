'use client';

import { useState, useEffect } from 'react';
import { enhancedDataService } from '@/lib/enhanced_realistic_data_service';
import { User, EmployeeDashboardStats } from '@/types';
import WeeklyTimesheet from '@/components/WeeklyTimesheet';
import { Clock, Plus, FileText } from 'lucide-react';

interface EmployeeDashboardProps {
  user: User;
}

export default function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  const [stats, setStats] = useState<EmployeeDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timesheet' | 'overview' | 'history'>('timesheet');

  useEffect(() => {
    loadStats();
  }, [user.id]);

  const loadStats = async () => {
    try {
      const dashboardStats = await enhancedDataService.getDashboardStats(user.id);
      setStats(dashboardStats);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, color = 'blue' }: {
    title: string;
    value: string | number;
    subtitle?: string;
    color?: 'blue' | 'green' | 'yellow' | 'purple';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200'
    };

    return (
      <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
        <h3 className="text-sm font-medium opacity-75">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {subtitle && <p className="text-sm opacity-75 mt-1">{subtitle}</p>}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.first_name}!
            </h1>
            <p className="text-gray-600 mt-1">
              {user.role} • {user.role} Department
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Employee
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Employee ID</p>
            <p className="font-mono text-gray-900">{user.id}</p>
          </div>
        </div>
      </div>

      {/* Timesheet Entry Prominent Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Timesheet Entry</h2>
              <p className="text-blue-100 mt-1">Quickly log your time and submit for approval</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <a 
              href="/timesheet/entry" 
              className="flex items-center px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Entry
            </a>
            <a 
              href="/timesheet" 
              className="flex items-center px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors"
            >
              <FileText className="h-5 w-5 mr-2" />
              View Timesheet
            </a>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="This Week Hours"
            value={stats.thisWeekHours?.toFixed(1) || '0'}
            subtitle="Monday - Friday"
            color="blue"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals || 0}
            subtitle="Awaiting review"
            color="yellow"
          />
          <StatCard
            title="Active Projects"
            value={stats.totalProjects || 0}
            subtitle="Currently assigned"
            color="green"
          />
          <StatCard
            title="Total Entries"
            value={stats.totalEntries || 0}
            subtitle="All time"
            color="purple"
          />
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'timesheet', label: 'Weekly Timesheet', icon: '📅' },
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'history', label: 'History', icon: '📋' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'timesheet' | 'overview' | 'history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'timesheet' && (
            <WeeklyTimesheet />
          )}
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last timesheet submitted</span>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Hours this month</span>
                      <span className="font-medium">{(stats?.thisWeekHours ? stats.thisWeekHours * 4 : 0).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average daily hours</span>
                      <span className="font-medium">{(stats?.thisWeekHours ? stats.thisWeekHours / 5 : 0).toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <a href="/timesheet/entry" className="block w-full text-left p-3 bg-white rounded-md hover:bg-gray-50 border border-gray-200">
                      ⏰ New Time Entry
                    </a>
                    <a href="/timesheet" className="block w-full text-left p-3 bg-white rounded-md hover:bg-gray-50 border border-gray-200">
                      📝 View Timesheet
                    </a>
                    <button className="w-full text-left p-3 bg-white rounded-md hover:bg-gray-50 border border-gray-200">
                      👤 Update Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Timesheet History</h3>
              <p className="text-gray-600 mb-4">
                View and manage your previous timesheet submissions
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Coming Soon
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
