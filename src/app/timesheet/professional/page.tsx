import ProfessionalWeeklyTimesheet from '@/components/ProfessionalWeeklyTimesheet'

export default function ProfessionalTimesheetPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Professional Weekly Timesheet</h1>
          <p className="text-lg text-gray-600">West End Workforce - Enterprise Timesheet Solution</p>
        </div>
        
        <div className="mb-8 text-center">
          <div className="flex justify-center space-x-4">
            <a
              href="/timesheet"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Standard View
            </a>
            <a
              href="/timesheet/simple"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Simple View
            </a>
          </div>
        </div>
        
        <ProfessionalWeeklyTimesheet />
      </div>
    </div>
  )
}
