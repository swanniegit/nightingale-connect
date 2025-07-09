import { useEffect, useRef, useState } from 'react';
import { Message } from '@shared/schema';

interface WebSocketMessage {
  type: 'message';
  data: Message;
}

export function useWebSocket(userId: string, channelId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // Join the channel
      ws.send(JSON.stringify({
        type: 'join',
        userId,
        channelId,
      }));
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      // Process WebSocket message
      
      if (message.type === 'message') {
        setMessages(prev => {
          // Avoid duplicates by checking if message already exists
          const exists = prev.find(m => m.id === message.data.id);
          if (exists) {
            return prev;
          }
          return [...prev, message.data];
        });
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [userId, channelId]);

  const sendMessage = (content: string, attachments: any[] = [], replyToId?: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat',
        content,
        attachments,
        replyToId,
        userId,
        channelId,
      }));
    }
  };

  return {
    messages,
    isConnected,
    sendMessage,
  };
}
