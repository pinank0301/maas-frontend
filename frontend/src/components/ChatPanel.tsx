import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Send, Loader2, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSubmit: (message: string) => void;
  isGenerating: boolean;
  className?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSubmit,
  isGenerating,
  className = '',
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isGenerating) {
      onSubmit(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  useEffect(() => {
    // Focus textarea on mount
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format assistant message content to extract readable parts
  const formatAssistantContent = (content: string) => {
    // Try to extract meaningful content from assistant responses
    if (content.includes('Mock') && content.includes('route created successfully')) {
      // Extract the main message
      const lines = content.split('\n');
      const mainMessage = lines.find(line => 
        line.includes('Mock') && line.includes('route created successfully')
      );
      return mainMessage || content;
    }
    
    // If content contains JSON blocks, try to extract readable parts
    if (content.includes('{') && content.includes('}')) {
      try {
        // Split by json blocks and extract readable text
        const parts = content.split(/json\s*\{[^}]*\}/g);
        const readableParts = parts
          .map(part => part.trim())
          .filter(part => part && !part.startsWith('{'))
          .join(' ')
          .trim();
        
        if (readableParts) {
          return readableParts;
        }
      } catch (error) {
        // If parsing fails, return original content
      }
    }
    
    return content;
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4 md:p-6">
        <div className="h-[600px] flex flex-col">
          {/* Header */}
          <div className="mb-4 pb-4 border-b">
            <h2 className="text-lg font-semibold">Chat</h2>
            <p className="text-sm text-muted-foreground">
              Discuss your API requirements and modifications
            </p>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4" role="log" aria-label="Chat messages">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Welcome to your Mock API Chat</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Start the conversation to discuss your API requirements, 
                    request modifications, or ask questions about your mock data.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                    role="article"
                    aria-label={`Message from ${msg.sender === 'user' ? 'you' : 'assistant'} at ${formatTime(msg.timestamp)}`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 mt-0.5">
                        {msg.sender === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.sender === 'assistant' 
                            ? formatAssistantContent(msg.content) 
                            : msg.content
                          }
                        </p>
                        <p className="text-xs opacity-70 mt-2">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Loading indicator */}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Assistant is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex space-x-2">
                <Textarea
                  ref={textareaRef}
                  placeholder="Type your message here..."
                  value={message}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  disabled={isGenerating}
                  className="flex-1 min-h-[60px] max-h-[120px] resize-none focus:ring-2 focus:ring-primary"
                  aria-label="Type your message"
                />
                <Button
                  type="submit"
                  disabled={!message.trim() || isGenerating}
                  className="px-6"
                  aria-label="Send message"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter to send, Shift+Enter for new line
              </p>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};