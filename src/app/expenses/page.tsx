'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Receipt, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ExpensesPage() {
  const { appUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!appUser) {
      router.push('/auth/signin');
    } else {
      setIsLoading(false);
    }
  }, [appUser, router]);

  if (isLoading || !appUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Track and submit your business expenses for approval
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-8xl mb-6">💰</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Expense Tracking Coming Soon
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We're working on a comprehensive expense management system that will allow you to:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Receipt className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Submit Receipts</h3>
              <p className="text-sm text-gray-600">Upload and categorize expense receipts</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#05202E]/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Plus className="h-8 w-8 text-[#05202E]" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Track Spending</h3>
              <p className="text-sm text-gray-600">Monitor your expense categories and budgets</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Receipt className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Get Approvals</h3>
              <p className="text-sm text-gray-600">Streamlined approval workflow</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              For now, please use the timesheet system in your dashboard to track time-based expenses.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
