import ProjectManagement from '@/components/ProjectManagement'

export default function TestProjectManagement() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Project Management</h1>
        <ProjectManagement />
      </div>
    </div>
  )
}
