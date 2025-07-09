import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/hooks/useAuth';
import { Message } from '@shared/schema';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
// AI components removed from chat
import FAQModal from '@/components/modals/FAQModal';
import EducationModal from '@/components/modals/EducationModal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, MessageCircle, GraduationCap, HelpCircle, MapPin, LogOut, Settings } from 'lucide-react';
import { Link } from 'wouter';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import nightingaleLogoCircle from '@/assets/nightingale-logo-circle.jpg';

const CURRENT_CHANNEL_ID = 1;

export default function Chat() {
  const { user } = useAuth();
  const [showFAQ, setShowFAQ] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [highlightFaqId, setHighlightFaqId] = useState<number | undefined>();
  const [initialMessages, setInitialMessages] = useState([]);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { messages, isConnected, sendMessage } = useWebSocket(user?.id || '', CURRENT_CHANNEL_ID);
  
  // No notification system needed for simple chat

  // Enhanced send message with auto-scroll and reply support
  const handleSendMessage = (content: string, attachments?: any[], replyToId?: number) => {
    sendMessage(content, attachments, replyToId);
    setReplyToMessage(null); // Clear reply after sending
    // Small delay to ensure message is sent before scrolling
    setTimeout(scrollToBottom, 100);
  };

  // Handle reply to message
  const handleReply = (message: Message) => {
    setReplyToMessage(message);
  };

  // Cancel reply
  const handleCancelReply = () => {
    setReplyToMessage(null);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Fetch initial messages
  const { data: existingMessages } = useQuery({
    queryKey: [`/api/channels/${CURRENT_CHANNEL_ID}/messages`],
    enabled: isConnected,
  });

  // Fetch channel info
  const { data: channel } = useQuery({
    queryKey: [`/api/channels/${CURRENT_CHANNEL_ID}`],
  });

  // Combine existing messages with new ones, avoiding duplicates
  const existingMessageIds = new Set((existingMessages || []).map(msg => msg.id));
  const allMessages = [...(existingMessages || [])];
  
  // Add new WebSocket messages that aren't already in existingMessages
  messages.forEach(newMessage => {
    if (!existingMessageIds.has(newMessage.id)) {
      allMessages.push(newMessage);
    }
  });
  
  // Debug: Log message counts
  console.log('Messages loaded:', allMessages.length);

  // Function to scroll to bottom of chat
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  // Auto-scroll when new messages appear
  useEffect(() => {
    // Auto-scroll to latest message
    setTimeout(scrollToBottom, 100);
  }, [allMessages]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (existingMessages && existingMessages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [existingMessages]);

  // Function to open FAQ modal with specific FAQ highlighted
  const openFAQWithHighlight = (faqId?: number) => {
    setHighlightFaqId(faqId);
    setShowFAQ(true);
  };

  // Reset highlight when modal closes
  const closeFAQ = () => {
    setShowFAQ(false);
    setHighlightFaqId(undefined);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <img 
                  src={nightingaleLogoCircle} 
                  alt="Nightingale Connect Logo" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <Link href="/">
                  <span className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors cursor-pointer">
                    Nightingale Connect
                  </span>
                </Link>
                <p className="text-xs text-gray-500">
                  {channel?.name || 'General Discussion'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFAQ(true)}
                className="p-2 text-gray-600 hover:text-primary"
                title="Frequently Asked Questions"
              >
                <HelpCircle className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEducation(true)}
                className="p-2 text-gray-600 hover:text-primary"
                title="Educational Resources"
              >
                <GraduationCap className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('/practitioners-map', '_blank')}
                className="p-2 text-gray-600 hover:text-primary"
                title="Find Practitioners"
              >
                <MapPin className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-gray-600 hover:text-primary"
                    title="User Profile"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-700">
                    {user?.username || 'User'}
                  </div>
                  <div className="px-2 py-1 text-xs text-gray-500 capitalize">
                    {user?.role || 'nurse'}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/user-guide">
                      <Settings className="w-4 h-4 mr-2" />
                      User Guide
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 custom-scrollbar min-h-0 max-h-full overflow-auto">
          <div className="space-y-4 pb-4">
            {/* Welcome Message */}
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 text-center">
              <User className="text-secondary w-8 h-8 mx-auto mb-2" />
              <p className="text-sm text-secondary font-medium">Welcome to NursePrac Connect</p>
              <p className="text-xs text-gray-600 mt-1">
                Professional discussion board for South African nurse practitioners
              </p>
            </div>

            {/* Messages */}
            {allMessages.map((message, index) => (
              <div key={message.id || index} className="space-y-3">
                <ChatMessage 
                  message={message} 
                  isCurrentUser={message.userId === user.id}
                  onReply={handleReply}
                />
              </div>
            ))}

            {/* Connection Status */}
            {!isConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <p className="text-sm text-yellow-800">Reconnecting...</p>
              </div>
            )}

            {/* Connection Status */}
            {!isConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <p className="text-sm text-yellow-800">Reconnecting...</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
          <ChatInput 
            onSendMessage={handleSendMessage}
            replyToMessage={replyToMessage}
            onCancelReply={handleCancelReply}
          />
        </div>
      </main>

      {/* Modals */}
      <FAQModal 
        isOpen={showFAQ} 
        onClose={closeFAQ}
        highlightFaqId={highlightFaqId}
      />
      <EducationModal 
        isOpen={showEducation} 
        onClose={() => setShowEducation(false)} 
      />
    </div>
  );
}
