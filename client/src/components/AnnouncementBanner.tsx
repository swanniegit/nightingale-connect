import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ExternalLink, Download, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Announcement } from '@shared/schema';

export default function AnnouncementBanner() {
  const { user } = useAuth();
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);

  // Get active announcements
  const { data: announcements } = useQuery({
    queryKey: ['/api/announcements/active'],
    enabled: !!user,
  });

  useEffect(() => {
    if (!user || !announcements || announcements.length === 0) return;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Find announcements that haven't been viewed today
    const unviewedAnnouncement = announcements.find((announcement: Announcement) => {
      const startDate = new Date(announcement.startDate).toISOString().split('T')[0];
      const endDate = new Date(announcement.endDate).toISOString().split('T')[0];
      
      return startDate <= today && endDate >= today && announcement.isActive;
    });

    if (unviewedAnnouncement) {
      // Check if user has viewed this announcement today
      checkAnnouncementView(unviewedAnnouncement.id, today).then((hasViewed) => {
        if (!hasViewed) {
          setCurrentAnnouncement(unviewedAnnouncement);
          setShowAnnouncement(true);
        }
      });
    }
  }, [user, announcements]);

  const checkAnnouncementView = async (announcementId: number, viewedDate: string): Promise<boolean> => {
    try {
      const response = await apiRequest('GET', `/api/announcements/${announcementId}/viewed?date=${viewedDate}`);
      const data = await response.json();
      return data.hasViewed;
    } catch (error) {
      return false;
    }
  };

  const markAnnouncementViewed = async () => {
    if (!currentAnnouncement || !user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await apiRequest('POST', '/api/announcements/mark-viewed', {
        announcementId: currentAnnouncement.id,
        userId: user.id,
        viewedDate: today
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
    } catch (error) {
      console.error('Error marking announcement as viewed:', error);
    }
  };

  const handleClose = () => {
    markAnnouncementViewed();
    setShowAnnouncement(false);
    setCurrentAnnouncement(null);
  };

  const handleLinkClick = () => {
    if (currentAnnouncement?.linkUrl) {
      window.open(currentAnnouncement.linkUrl, '_blank');
    }
  };

  if (!showAnnouncement || !currentAnnouncement) return null;

  return (
    <Dialog open={showAnnouncement} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-red-50 to-red-100 border-4 border-red-500">
        <div className="relative">
          {/* Close button */}
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 text-red-600 hover:text-red-800 hover:bg-red-200"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Header */}
          <div className="text-center mb-6 pt-4">
            <div className="text-6xl mb-4">🚨</div>
            <Badge className="bg-red-600 text-white text-lg px-4 py-2 mb-4">
              IMPORTANT ANNOUNCEMENT
            </Badge>
            <h1 className="text-4xl font-bold text-red-800 mb-2">
              {currentAnnouncement.title}
            </h1>
          </div>

          {/* Content */}
          <div className="bg-white border-2 border-red-400 rounded-lg p-6 mb-6">
            <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
              {currentAnnouncement.content}
            </div>
          </div>

          {/* Attachments */}
          {currentAnnouncement.attachments && Array.isArray(currentAnnouncement.attachments) && currentAnnouncement.attachments.length > 0 && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3">📎 Attachments</h3>
              <div className="space-y-2">
                {currentAnnouncement.attachments.map((attachment: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border border-red-200 rounded">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800">{attachment.originalName}</span>
                      {attachment.size && (
                        <span className="text-sm text-gray-600">
                          ({Math.round(attachment.size / 1024)} KB)
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        // Handle download
                        const link = document.createElement('a');
                        link.href = `/api/attachments/${attachment.filename || attachment.originalName}`;
                        link.download = attachment.originalName || 'download';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {currentAnnouncement.linkUrl && currentAnnouncement.linkText && (
              <Button
                onClick={handleLinkClick}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                {currentAnnouncement.linkText}
              </Button>
            )}
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold py-4 text-lg"
            >
              I've Read This - Continue to Platform
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-red-700">
            <p>This announcement will be shown once per day until {new Date(currentAnnouncement.endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}