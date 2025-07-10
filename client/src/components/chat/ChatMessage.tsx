import { formatDistanceToNow } from 'date-fns';
import { Message } from '@shared/schema';
import { FileText, Download, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useQuery } from '@tanstack/react-query';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  onReply?: (message: Message) => void;
}

export default function ChatMessage({ message, isCurrentUser, onReply }: ChatMessageProps) {
  const initials = isCurrentUser ? 'You' : 'U'; // In a real app, get user info
  const timeAgo = message.createdAt ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true }) : '';

  // Fetch the replied-to message if this is a reply
  const { data: repliedMessage } = useQuery({
    queryKey: [`/api/messages/${message.replyToId}`],
    enabled: !!message.replyToId,
  });

  return (
    <div className={`flex items-start space-x-3 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isCurrentUser ? 'bg-primary' : 'bg-blue-500'
      }`}>
        <span className="text-white text-xs font-medium">{initials}</span>
      </div>
      
      <div className="flex-1 max-w-[85%]">
        <div className={`rounded-lg p-3 shadow-sm ${
          message.replyToId
            ? isCurrentUser 
              ? 'bg-purple-600 text-white border border-purple-700' 
              : 'bg-purple-50 border border-purple-200 text-purple-900'
            : message.attachments && Array.isArray(message.attachments) && message.attachments.length > 0
              ? isCurrentUser
                ? 'bg-green-600 text-white border border-green-700'
                : 'bg-green-50 border border-green-200 text-green-900'
              : isCurrentUser 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-white border border-gray-200'
        }`}>
          {/* Replied message preview */}
          {repliedMessage && (
            <div className={`border-l-4 pl-2 mb-2 pb-2 ${
              message.replyToId
                ? isCurrentUser
                  ? 'border-l-purple-300 bg-purple-700/20'
                  : 'border-l-purple-400 bg-purple-100'
                : message.attachments && Array.isArray(message.attachments) && message.attachments.length > 0
                  ? isCurrentUser
                    ? 'border-l-green-300 bg-green-700/20'
                    : 'border-l-green-400 bg-green-100'
                  : 'border-l-blue-500 bg-gray-50'
            }`}>
              <p className={`text-xs font-medium ${
                message.replyToId
                  ? isCurrentUser
                    ? 'text-purple-100'
                    : 'text-purple-700'
                  : message.attachments && Array.isArray(message.attachments) && message.attachments.length > 0
                    ? isCurrentUser
                      ? 'text-green-100'
                      : 'text-green-700'
                    : isCurrentUser
                      ? 'text-primary-foreground/90'
                      : 'text-gray-600'
              }`}>
                Replying to:
              </p>
              <p className={`text-xs ${
                message.replyToId
                  ? isCurrentUser
                    ? 'text-purple-200'
                    : 'text-purple-600'
                  : message.attachments && Array.isArray(message.attachments) && message.attachments.length > 0
                    ? isCurrentUser
                      ? 'text-green-200'
                      : 'text-green-600'
                    : isCurrentUser
                      ? 'text-primary-foreground/80'
                      : 'text-gray-500'
              }`}>
                {repliedMessage.content.length > 50 
                  ? `${repliedMessage.content.substring(0, 50)}...` 
                  : repliedMessage.content}
              </p>
            </div>
          )}
          
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {/* Attachments */}
          {message.attachments && Array.isArray(message.attachments) && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment: any, index: number) => (
                <div key={index} className={`border rounded-lg p-3 ${
                  message.replyToId
                    ? isCurrentUser
                      ? 'border-purple-300/30 bg-purple-700/10'
                      : 'border-purple-200 bg-purple-50'
                    : message.attachments && Array.isArray(message.attachments) && message.attachments.length > 0
                      ? isCurrentUser
                        ? 'border-green-300/30 bg-green-700/10'
                        : 'border-green-200 bg-green-50'
                      : isCurrentUser
                        ? 'border-primary-foreground/20 bg-primary-foreground/10'
                        : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      message.replyToId
                        ? isCurrentUser
                          ? 'bg-purple-400/30'
                          : 'bg-purple-500'
                        : isCurrentUser
                          ? 'bg-primary-foreground/20'
                          : 'bg-red-500'
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        message.replyToId
                          ? isCurrentUser
                            ? 'text-purple-200'
                            : 'text-white'
                          : isCurrentUser
                            ? 'text-primary-foreground'
                            : 'text-white'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        message.replyToId
                          ? isCurrentUser
                            ? 'text-purple-100'
                            : 'text-purple-900'
                          : isCurrentUser
                            ? 'text-primary-foreground'
                            : 'text-gray-900'
                      }`}>
                        {attachment.originalName || 'Unknown file'}
                      </p>
                      <p className={`text-xs ${
                        message.replyToId
                          ? isCurrentUser
                            ? 'text-purple-200'
                            : 'text-purple-600'
                          : isCurrentUser
                            ? 'text-primary-foreground/70'
                            : 'text-gray-500'
                      }`}>
                        {attachment.size ? `${Math.round(attachment.size / 1024)} KB` : 'Unknown size'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-1 ${
                        message.replyToId
                          ? isCurrentUser
                            ? 'text-purple-200 hover:bg-purple-400/20'
                            : 'text-purple-700 hover:bg-purple-100'
                          : isCurrentUser
                            ? 'text-primary-foreground hover:bg-primary-foreground/20'
                            : 'text-primary hover:bg-primary/10'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <p className={`text-xs ${
              isCurrentUser ? 'text-primary-foreground/70' : 'text-gray-500'
            }`}>
              {isCurrentUser ? 'You' : 'User'} • {timeAgo}
            </p>
            
            {onReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(message)}
                className={`p-1 h-6 ${
                  isCurrentUser 
                    ? 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/20' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title="Reply to this message"
              >
                <Reply className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
