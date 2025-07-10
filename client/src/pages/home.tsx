import { useState } from 'react';
import { useAuth } from "@/hooks/useAuth.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Bell, MessageSquare, Users, MapPin, FileText, LogOut, Megaphone, BookOpen, BarChart3, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import AnnouncementModal from "@/components/modals/AnnouncementModal.tsx";
import FAQModal from "@/components/modals/FAQModal.tsx";
import EducationModal from "@/components/modals/EducationModal.tsx";
import nightingaleLogoFull from '@/assets/nightingale-logo-full.jpg';

export default function Home() {
  const { user, logout, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [educationModalOpen, setEducationModalOpen] = useState(false);
  
  // If user is not admin, redirect to chat
  if (user && user.role !== 'admin') {
    setLocation('/chat');
    return null;
  }

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  const { data: channels } = useQuery({
    queryKey: ["/api/channels"],
    enabled: !!user?.isApproved,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user?.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <Bell className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <CardTitle>Account Pending Approval</CardTitle>
            <CardDescription>
              Your registration is being reviewed by our admin team. 
              You'll receive an email notification once approved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user?.firstName || user?.username}!
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Location: {user?.location || 'Not specified'}
              </p>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/api/logout'}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <span className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors cursor-pointer">
                Nightingale Connect
              </span>
            </Link>
            <Badge variant={user?.role === 'admin' ? 'default' : user?.role === 'senior' ? 'secondary' : 'outline'}>
              {user?.role}
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Bell className="h-5 w-5 text-gray-500" />
              {notifications?.length > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                  {notifications.length}
                </Badge>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        {/* Welcome Section for Regular Users */}
        {user?.role !== 'admin' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.firstName || user?.username}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Location: {user?.location || 'Not specified'} • Online status: {user?.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        )}

        {/* Admin Dashboard */}
        {user?.role === 'admin' && (
          <>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-6 mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">
                Welcome to the Admin Dashboard
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Manage your nursing community platform with powerful administrative tools
              </p>
            </div>

            {/* Admin Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Chat Management */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary/20 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <MessageSquare className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Chat Management
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Moderate discussions, manage AI suggestions, and oversee community interactions.
                </p>
                <Link href="/chat">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Manage Chat
                  </Button>
                </Link>
              </div>

              {/* Content Management */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary/20 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Educational Content
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create, edit, and organize educational content and blog posts.
                </p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setEducationModalOpen(true)}
                >
                  Manage Content
                </Button>
              </div>

              {/* FAQ Management */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary/20 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <HelpCircle className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    FAQ Management
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create, edit, and organize frequently asked questions and answers.
                </p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setFaqModalOpen(true)}
                >
                  Manage FAQs
                </Button>
              </div>

              {/* Announcements */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary/20 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <Megaphone className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Announcements
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create important announcements that will be displayed to all users.
                </p>
                <Button 
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => setShowAnnouncementModal(true)}
                >
                  Create Announcement
                </Button>
              </div>

              {/* User Management */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary/20 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    User Management
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Approve new users, manage roles, and oversee platform membership.
                </p>
                <Button className="w-full" variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>

              {/* Find Practitioners */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary/20 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Practitioners Map
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  View and manage the practitioner location directory across South Africa.
                </p>
                <Link href="/practitioners-map">
                  <Button className="w-full border-primary text-primary hover:bg-primary hover:text-white" variant="outline">
                    View Map
                  </Button>
                </Link>
              </div>

              {/* Analytics */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary/20 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Analytics
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  View platform usage statistics, engagement metrics, and user activity.
                </p>
                <Button className="w-full" variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Regular User Quick Actions */}
        {user?.role !== 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <Link href="/chat">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Chats
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{channels?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Available channels
                  </p>
                </CardContent>
              </Link>
            </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Notifications
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Unread notifications
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => window.open('/practitioners-map', '_blank')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Find Practitioners
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Map View</div>
              <p className="text-xs text-muted-foreground">
                View practitioners near you
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resources
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                Educational materials
              </p>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications?.slice(0, 5).map((notification: any) => (
                <div key={notification.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {notification.message}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {(!notifications || notifications.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No recent activity. Start chatting to see updates here!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {notifications && notifications.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {user?.role === 'admin' ? 'Recent Administrative Activity' : 'Recent Activity'}
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary/20 divide-y">
              {notifications.slice(0, 5).map((notification: any) => (
                <div key={notification.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnnouncementModal 
        isOpen={showAnnouncementModal} 
        onClose={() => setShowAnnouncementModal(false)} 
      />
      
      <FAQModal 
        isOpen={faqModalOpen} 
        onClose={() => setFaqModalOpen(false)}
      />
      
      <EducationModal 
        isOpen={educationModalOpen} 
        onClose={() => setEducationModalOpen(false)}
      />
    </div>
  );
}