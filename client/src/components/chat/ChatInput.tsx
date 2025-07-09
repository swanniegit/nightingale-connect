import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@shared/schema';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: any[], replyToId?: number) => void;
  replyToMessage?: Message | null;
  onCancelReply?: () => void;
}

export default function ChatInput({ onSendMessage, replyToMessage, onCancelReply }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments, replyToMessage?.id);
      setMessage('');
      setAttachments([]);
      onCancelReply?.(); // Clear the reply when sending
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const fileData = await response.json();
      setAttachments(prev => [...prev, fileData]);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been attached to your message`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Reply Preview */}
      {replyToMessage && (
        <div className="bg-blue-50 border-l-4 border-l-blue-500 p-3 rounded-r-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-800 mb-1">Replying to:</p>
              <p className="text-sm text-blue-700 line-clamp-2">
                {replyToMessage.content.length > 100 
                  ? `${replyToMessage.content.substring(0, 100)}...` 
                  : replyToMessage.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelReply}
              className="p-1 h-auto text-blue-600 hover:text-blue-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-2 flex items-center space-x-2">
              <span className="text-sm text-gray-700">{attachment.originalName}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAttachment(index)}
                className="p-1 h-auto text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input Area */}
      <div className="flex items-end space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-2 text-gray-600 hover:text-primary"
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[44px] max-h-32 resize-none rounded-full border-gray-300 focus:border-primary focus:ring-primary"
            rows={1}
          />
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() && attachments.length === 0}
          className="p-2 rounded-full bg-primary hover:bg-primary/90"
        >
          <Send className="w-5 h-5" />
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
        />
      </div>
    </div>
  );
}
