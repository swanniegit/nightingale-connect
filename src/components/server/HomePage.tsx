import { Header } from '@/components/server/Header'
import { Footer } from '@/components/server/Footer'
import { EnhancedChatRoom } from '@/components/client/EnhancedChatRoom'
import { ApiTest } from '@/components/client/ApiTest'
import { SyncTest } from '@/components/client/SyncTest'
import { AuthTest } from '@/components/client/AuthTest'
import { AuthProvider } from '@/components/providers/AuthProvider'

// CATEGORY: Server Component
// CONTEXT: Server
export function HomePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome to Nightingale Connect
              </h2>
              <p className="text-gray-600">
                Secure healthcare communication platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnhancedChatRoom roomId="general" roomName="General Chat" />
              <EnhancedChatRoom roomId="emergency" roomName="Emergency Response" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ApiTest />
              <SyncTest />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AuthTest />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  )
}
