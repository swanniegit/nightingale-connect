import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Calendar } from '@/components/ui/calendar.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { apiRequest, queryClient } from '@/lib/queryClient.ts';
import { useToast } from '@/hooks/use-toast.ts';
import { useAuth } from '@/hooks/useAuth.ts';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnnouncementModal({ isOpen, onClose }: AnnouncementModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 1 week from now
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!title || !content || !startDate || !endDate) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      const announcementData = {
        title,
        content,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        linkUrl: linkUrl || null,
        linkText: linkText || null,
        createdBy: user?.id || '',
        isActive: true,
        attachments: attachment ? [{ 
          originalName: attachment.name,
          size: attachment.size,
          type: attachment.type 
        }] : []
      };

      await apiRequest('POST', '/api/announcements', announcementData);
      
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      
      // Reset form
      setTitle('');
      setContent('');
      setStartDate(new Date());
      setEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      setLinkUrl('');
      setLinkText('');
      setAttachment(null);
      
      toast({ title: "Announcement created successfully!" });
      onClose();
    } catch (error) {
      console.error('Announcement creation error:', error);
      toast({ title: "Failed to create announcement", variant: "destructive" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-red-600 text-xl font-bold">
            🚨 Create Important Announcement
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-red-700 font-semibold">
              Announcement Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title..."
              className="border-red-200 focus:border-red-500"
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content" className="text-red-700 font-semibold">
              Announcement Content *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the full announcement content..."
              className="min-h-[150px] border-red-200 focus:border-red-500"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-red-700 font-semibold">Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-red-200"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-red-700 font-semibold">End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-red-200"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Optional Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkText" className="text-red-700">
                Link Text (optional)
              </Label>
              <Input
                id="linkText"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g., Read More, View Details"
                className="border-red-200 focus:border-red-500"
              />
            </div>
            <div>
              <Label htmlFor="linkUrl" className="text-red-700">
                Link URL (optional)
              </Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="border-red-200 focus:border-red-500"
              />
            </div>
          </div>

          {/* File Attachment */}
          <div>
            <Label className="text-red-700 font-semibold">
              Attachment (optional)
            </Label>
            {!attachment ? (
              <div className="border-2 border-dashed border-red-300 rounded-lg p-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="announcement-file"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="announcement-file"
                  className="cursor-pointer flex flex-col items-center text-red-600 hover:text-red-800"
                >
                  <Upload className="w-8 h-8 mb-2" />
                  <span>Click to upload attachment</span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF, DOC, TXT, or Image files
                  </span>
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                <span className="text-red-700">{attachment.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={removeAttachment}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3"
            >
              Create Announcement
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}