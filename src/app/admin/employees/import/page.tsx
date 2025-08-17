'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  Users,
  CheckCircle,
  AlertCircle,
  Download,
  X,
  ArrowRight,
  Eye,
  Edit3
} from 'lucide-react'

interface ImportStep {
  id: string
  title: string
  description: string
  completed: boolean
}

interface EmployeeData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  employmentType: string
  hourlyRate: number
  startDate: string
  status: string
}

interface ColumnMapping {
  [key: string]: string
}

export default function EmployeeImportPage() {
  const router = useRouter()
  const { user: appUser, loading } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({})
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e31c79] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!appUser || appUser.role !== 'admin') {
    router.push('/auth/signin')
    return null
  }

  const importSteps: ImportStep[] = [
    {
      id: 'upload',
      title: 'Upload File',
      description: 'Select and upload your Excel file',
      completed: !!uploadedFile
    },
    {
      id: 'mapping',
      title: 'Column Mapping',
      description: 'Map Excel columns to employee fields',
      completed: Object.keys(columnMapping).length > 0
    },
    {
      id: 'validation',
      title: 'Data Validation',
      description: 'Review and validate employee data',
      completed: validationErrors.length === 0 && employeeData.length > 0
    },
    {
      id: 'import',
      title: 'Import Data',
      description: 'Import employees into the system',
      completed: false
    }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.includes('spreadsheet')) {
      setUploadedFile(file)
      // Simulate file processing
      setTimeout(() => {
        setCurrentStep(1)
      }, 1000)
    } else {
      alert('Please select a valid Excel file (.xlsx, .xls)')
    }
  }

  const handleColumnMapping = (excelColumn: string, employeeField: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [excelColumn]: employeeField
    }))
  }

  const handleNextStep = () => {
    if (currentStep < importSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleImport = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      alert(`Successfully imported ${employeeData.length} employees!`)
      router.push('/admin/employees')
    } catch (error) {
      alert('Error importing employees. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderUploadStep = () => (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-[#e31c79] rounded-full flex items-center justify-center mb-6">
        <Upload className="h-12 w-12 text-white" />
      </div>
      <h3 className="text-lg font-medium text-[#232020] mb-2">Upload Employee Data</h3>
      <p className="text-[#465079] mb-6">
        Upload an Excel file (.xlsx, .xls) containing employee information
      </p>
      
      <div className="max-w-md mx-auto">
        <label className="block w-full">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-[#e31c79] transition-colors duration-200 cursor-pointer">
            <div className="text-center">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-[#465079]">
                <span className="font-medium text-[#e31c79]">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-2">Excel files only</p>
            </div>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-8 text-sm text-[#465079]">
        <p className="font-medium mb-2">Expected columns:</p>
        <p>First Name, Last Name, Email, Phone, Role, Department, Employment Type, Hourly Rate, Start Date</p>
      </div>
    </div>
  )

  const renderMappingStep = () => (
    <div className="py-6">
      <h3 className="text-lg font-medium text-[#232020] mb-4">Map Excel Columns to Employee Fields</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-[#465079] mb-3">Excel Columns (Detected)</h4>
          <div className="space-y-2">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map((col) => (
              <div key={col} className="p-3 bg-gray-50 rounded-lg border">
                <span className="font-mono text-sm text-[#465079]">Column {col}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-[#465079] mb-3">Employee Fields</h4>
          <div className="space-y-2">
            {[
              'firstName',
              'lastName', 
              'email',
              'phone',
              'role',
              'department',
              'employmentType',
              'hourlyRate',
              'startDate'
            ].map((field) => (
              <div key={field} className="p-3 bg-white rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-[#232020] capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> The system will attempt to auto-map columns based on common naming patterns. 
              Review and adjust the mapping as needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderValidationStep = () => (
    <div className="py-6">
      <h3 className="text-lg font-medium text-[#232020] mb-4">Data Validation & Preview</h3>
      
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-800">Validation Errors Found</h4>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#465079] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#465079] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#465079] uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#465079] uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#465079] uppercase tracking-wider">
                Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#465079] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employeeData.slice(0, 5).map((employee, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[#232020]">
                    {employee.firstName} {employee.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#465079]">{employee.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#465079]">{employee.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#465079]">{employee.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#465079]">${employee.hourlyRate}/hr</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Valid
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {employeeData.length > 5 && (
        <div className="mt-4 text-center text-sm text-[#465079]">
          Showing first 5 of {employeeData.length} employees
        </div>
      )}
    </div>
  )

  const renderImportStep = () => (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-[#e31c79] rounded-full flex items-center justify-center mb-6">
        <Users className="h-12 w-12 text-white" />
      </div>
      <h3 className="text-lg font-medium text-[#232020] mb-2">Ready to Import</h3>
      <p className="text-[#465079] mb-6">
        Import {employeeData.length} employees into the system
      </p>
      
      <div className="max-w-md mx-auto space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-sm text-green-800">All data validated successfully</span>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-400 mr-2" />
            <span className="text-sm text-blue-800">This action cannot be undone</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderUploadStep()
      case 1:
        return renderMappingStep()
      case 2:
        return renderValidationStep()
      case 3:
        return renderImportStep()
      default:
        return renderUploadStep()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/admin/employees')}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-4"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#232020]">Import Employees</h1>
              <p className="text-[#465079]">Bulk import employees from Excel files</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-[#465079]">Role</p>
              <p className="text-sm font-medium text-[#232020] capitalize">Admin</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#465079]">Admin ID</p>
              <p className="text-sm font-medium text-[#232020]">admin-demo</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {importSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    index <= currentStep
                      ? 'border-[#e31c79] bg-[#e31c79] text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      index <= currentStep ? 'text-[#232020]' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className={`text-xs ${
                      index <= currentStep ? 'text-[#465079]' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  {index < importSteps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-[#e31c79]' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-[#232020]">
                Step {currentStep + 1}: {importSteps[currentStep].title}
              </h2>
            </div>

            <div className="p-6">
              {renderCurrentStep()}
            </div>

            {/* Step Navigation */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-[#465079] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e31c79] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push('/admin/employees')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-[#465079] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e31c79] transition-colors duration-200"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>

                  {currentStep < importSteps.length - 1 ? (
                    <button
                      onClick={handleNextStep}
                      disabled={!importSteps[currentStep].completed}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#e31c79] hover:bg-[#d4156a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e31c79] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      onClick={handleImport}
                      disabled={isProcessing}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#e31c79] hover:bg-[#d4156a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e31c79] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {isProcessing ? 'Importing...' : 'Import Employees'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
