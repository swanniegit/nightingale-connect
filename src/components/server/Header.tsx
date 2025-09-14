import { Logo } from '@/components/ui/Logo'

// CATEGORY: Server Component
// CONTEXT: Server
export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo variant="circle" size="md" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Nightingale Connect
              </h1>
              <p className="text-sm text-gray-600">
                Healthcare Communication Platform
              </p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Messages
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Practitioners
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Profile
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
