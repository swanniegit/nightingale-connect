import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { MessageCircle, Shield, Users, MapPin, Bot, FileText } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Nightingale Connect
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            A secure, professional platform for South African nurse practitioners to connect, 
            share knowledge, and collaborate on patient care.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" onClick={() => window.location.href = '/api/login'}>
              Sign In
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/user-guide'}>
              User Guide
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Professional Healthcare Communication
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Everything you need to connect with fellow healthcare professionals securely
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <CardTitle>Real-time Chat</CardTitle>
              <CardDescription>
                Instant messaging with colleagues, organized by specialties and regions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-green-600" />
              <CardTitle>Patient Data Protection</CardTitle>
              <CardDescription>
                Built-in safeguards to protect patient information with approval workflows
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Bot className="h-8 w-8 text-purple-600" />
              <CardTitle>AI-Powered Assistance</CardTitle>
              <CardDescription>
                Intelligent suggestions from validated FAQs and educational content
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 text-red-600" />
              <CardTitle>Location-Based Networking</CardTitle>
              <CardDescription>
                Connect with healthcare professionals in your area across South Africa
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-orange-600" />
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>
                Secure access control with nurse, senior, and admin roles
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-indigo-600" />
              <CardTitle>Educational Resources</CardTitle>
              <CardDescription>
                Access to FAQs, guidelines, and automatically organized documents
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 dark:bg-blue-800">
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to join the community?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Connect with thousands of nurse practitioners across South Africa
            </p>
            <div className="mt-8">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => window.location.href = '/api/login'}
              >
                Sign In to Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}