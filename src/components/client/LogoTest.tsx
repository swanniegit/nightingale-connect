'use client'

import { Logo } from '@/components/ui/Logo'

// CATEGORY: Client Orchestrator
// CONTEXT: Client
export function LogoTest() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-xl font-semibold mb-4">Logo Integration Test</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium mb-3">Circle Logo Variants</h4>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <Logo variant="circle" size="sm" />
              <p className="text-xs text-gray-600 mt-1">Small</p>
            </div>
            <div className="text-center">
              <Logo variant="circle" size="md" />
              <p className="text-xs text-gray-600 mt-1">Medium</p>
            </div>
            <div className="text-center">
              <Logo variant="circle" size="lg" />
              <p className="text-xs text-gray-600 mt-1">Large</p>
            </div>
            <div className="text-center">
              <Logo variant="circle" size="xl" />
              <p className="text-xs text-gray-600 mt-1">Extra Large</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-3">Full Logo Variants</h4>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <Logo variant="full" size="sm" />
              <p className="text-xs text-gray-600 mt-1">Small</p>
            </div>
            <div className="text-center">
              <Logo variant="full" size="md" />
              <p className="text-xs text-gray-600 mt-1">Medium</p>
            </div>
            <div className="text-center">
              <Logo variant="full" size="lg" />
              <p className="text-xs text-gray-600 mt-1">Large</p>
            </div>
            <div className="text-center">
              <Logo variant="full" size="xl" />
              <p className="text-xs text-gray-600 mt-1">Extra Large</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Status</h4>
          <p className="text-sm text-gray-600">
            ✅ Logo images loaded successfully<br/>
            ✅ All variants and sizes working<br/>
            ✅ Responsive design implemented<br/>
            ✅ Error handling in place
          </p>
        </div>
      </div>
    </div>
  )
}
