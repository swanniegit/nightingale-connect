import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { ArrowLeft, MessageCircle, Brain, BookOpen, HelpCircle, MapPin, Shield } from "lucide-react";
import { Link } from "wouter";

export default function UserGuide() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Guide</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to Nightingale Connect!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-center text-gray-600 dark:text-gray-400">
              A secure, professional communication platform designed specifically for South African nurse practitioners.
            </p>
          </CardContent>
        </Card>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <CardTitle>Real-Time Chat</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Join multiple discussion channels and communicate with colleagues instantly.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Reply to specific messages (purple theme)</li>
                <li>• Upload files and documents</li>
                <li>• Color-coded message types</li>
                <li>• Real-time notifications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Brain className="h-6 w-6 text-purple-600" />
                <CardTitle>AI-Powered Assistance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Get intelligent suggestions based on medical knowledge base.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Automatic message analysis</li>
                <li>• Links to relevant FAQs</li>
                <li>• Educational content recommendations</li>
                <li>• Context-aware responses</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <HelpCircle className="h-6 w-6 text-green-600" />
                <CardTitle>FAQ Database</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Access comprehensive frequently asked questions.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Search by category or keywords</li>
                <li>• Billing, procedures, regulations</li>
                <li>• Patient care guidelines</li>
                <li>• Updated by senior practitioners</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-6 w-6 text-orange-600" />
                <CardTitle>Educational Resources</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Browse blog posts, guidelines, and learning materials.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Professional blog posts</li>
                <li>• Clinical guidelines</li>
                <li>• Policy documents</li>
                <li>• Downloadable resources</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-red-600" />
                <CardTitle>Find Practitioners</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Connect with nurse practitioners in your area.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Location-based directory</li>
                <li>• Regional networking</li>
                <li>• Professional connections</li>
                <li>• South Africa coverage</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-indigo-600" />
                <CardTitle>Privacy Protection</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Built-in safeguards protect patient information.</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Automatic privacy detection</li>
                <li>• Secure communications</li>
                <li>• Professional guidelines</li>
                <li>• Healthcare compliance</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <div>
                  <h3 className="font-semibold">Register Your Account</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use your Replit account to sign up. Your account will be automatically approved.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <div>
                  <h3 className="font-semibold">Explore Chat Channels</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Join discussions in General Discussion, Emergency Care, or other relevant channels.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                <div>
                  <h3 className="font-semibold">Access Knowledge Resources</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use the FAQ and Education buttons to find answers and learning materials.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                <div>
                  <h3 className="font-semibold">Connect with Colleagues</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use the practitioner map to find and connect with professionals in your area.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">⚠️ Patient Privacy Protection</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Never share patient names, ID numbers, or identifying details. Use general terms when discussing cases. 
                The AI system helps detect potential privacy issues.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Communication Etiquette:</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Maintain professional language and tone</li>
                <li>• Be supportive and collaborative with colleagues</li>
                <li>• Stay on-topic in relevant channels</li>
                <li>• Verify information before sharing medical advice</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Chat Features:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Reply: Click "Reply" button on messages</li>
                  <li>• Upload: Click paperclip icon</li>
                  <li>• AI Help: Appears automatically below messages</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Resource Access:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• FAQs: Click "❓ FAQ" button in chat</li>
                  <li>• Education: Click "📖 Education" button</li>
                  <li>• Map: Click map icon in header</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Contact the admin team through the platform chat or check the FAQ section for additional guidance.
            </p>
            <div className="text-center mt-4">
              <Link href="/chat">
                <Button>
                  Start Using Nightingale Connect
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}