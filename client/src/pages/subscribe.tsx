import { useAuth } from "@/hooks/useAuth.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { CheckCircle, Brain, Zap, Clock, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient.ts";
import { Link } from "wouter";

export default function Subscribe() {
  const { user } = useAuth();

  // Get user's current LLM usage
  const { data: usage } = useQuery({
    queryKey: ['user-llm-usage'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/user/llm-usage');
      return res.json();
    }
  });

  const features = [
    { icon: Brain, text: "Unlimited AI-powered responses from GPT-4" },
    { icon: Zap, text: "Priority response time for AI suggestions" },
    { icon: Users, text: "Support the healthcare community platform" },
    { icon: Clock, text: "Early access to new AI features" }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to view subscription options.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-lg text-gray-600">
            Get unlimited AI assistance to enhance your healthcare practice
          </p>
        </div>

        {/* Current Usage */}
        {usage && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <Brain className="w-5 h-5" />
                <span>Current Usage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700">
                    You've seen <strong>{usage.count} of 10</strong> free LLM responses this month
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Usage resets on {new Date(usage.resetDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-32 bg-orange-200 rounded-full h-3">
                  <div 
                    className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (usage.count / 10) * 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Free Plan */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">Free Plan</CardTitle>
              <CardDescription>Great for trying out AI features</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">R 0</span>
                <span className="text-gray-600 ml-2">/ month</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">10 AI responses per month</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Basic chat functionality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Access to FAQ database</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-6"
                disabled={usage?.subscriptionStatus === 'free'}
              >
                {usage?.subscriptionStatus === 'free' ? 'Current Plan' : 'Downgrade'}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-purple-300 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Recommended
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-purple-700">Premium Plan</CardTitle>
              <CardDescription>Unlimited AI assistance for healthcare professionals</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold text-purple-700">R 50</span>
                <span className="text-gray-600 ml-2">/ month</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <feature.icon className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={usage?.subscriptionStatus === 'active'}
              >
                {usage?.subscriptionStatus === 'active' ? 'Current Plan' : 'Subscribe Now'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What happens when I reach my free limit?</h4>
                <p className="text-sm text-gray-600">
                  You'll still have access to all other platform features, but AI responses will show upgrade prompts until you subscribe or wait for the monthly reset.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Can I cancel anytime?</h4>
                <p className="text-sm text-gray-600">
                  Yes, you can cancel your subscription at any time. You'll continue to have premium access until the end of your billing period.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Is my data secure?</h4>
                <p className="text-sm text-gray-600">
                  Absolutely. We follow healthcare industry standards for data protection and never store sensitive patient information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Chat */}
        <div className="text-center mt-8">
          <Link href="/chat">
            <Button variant="outline">Back to Chat</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}