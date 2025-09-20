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
  onSubmit: (message: string) => void;
  isGenerating: boolean;
  className?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  onSubmit,
  isGenerating,
  className = '',
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isGenerating) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: message.trim(),
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setAnnouncement(`You sent: ${message.trim()}`);
      
      if (!hasStartedChat) {
        setHasStartedChat(true);
      }

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
  }, [messages]);

  useEffect(() => {
    // Focus textarea on mount
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Add assistant message when generation completes
  useEffect(() => {
    if (!isGenerating && hasStartedChat && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'user') {
        setIsTyping(true);
        
        // Simulate typing delay
        setTimeout(() => {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: "I've generated your mock API! Check the right panel to see the endpoints and sample data.",
            sender: 'assistant',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setAnnouncement(`Assistant responded: ${assistantMessage.content}`);
          setIsTyping(false);
        }, 1500);
      }
    }
  }, [isGenerating, hasStartedChat, messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>
      
      <Card className={`maas-chat-panel ${className}`}>
        <CardContent className={`p-4 md:p-6 maas-chat-form-to-messages ${hasStartedChat ? 'h-[600px] md:h-[600px] flex flex-col' : ''}`}>
        {!hasStartedChat ? (
          // Initial input form
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label 
                  htmlFor="api-description" 
                  className="text-sm font-medium text-foreground sr-only"
                >
                  API Description
                </label>
                <Textarea
                  ref={textareaRef}
                  id="api-description"
                  placeholder="Describe the API you want to mock..."
                  value={message}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  disabled={isGenerating || isTyping}
                  className="min-h-[100px] max-h-[120px] resize-none maas-focus-ring"
                  aria-label="Describe the API you want to mock"
                  aria-describedby="api-description-help"
                />
                <p 
                  id="api-description-help" 
                  className="text-xs text-muted-foreground"
                >
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating your mock API...</span>
                    </div>
                  ) : isTyping ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span>Assistant is responding...</span>
                    </div>
                  ) : (
                    <span>Ready to generate mock APIs</span>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!message.trim() || isGenerating || isTyping}
                  className="maas-focus-ring"
                  aria-label="Generate mock API"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Generate Mock
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Example prompts */}
            {!isGenerating && message.length === 0 && (
              <div className="mt-6 space-y-2">
                <p className="text-sm text-muted-foreground">Try these examples:</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Create a user management API with CRUD operations",
                    "Build an e-commerce API with products and orders",
                    "Generate a blog API with posts and comments",
                    "Create a simple todo API with tasks and categories"
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(example)}
                      className="text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors maas-focus-ring"
                      type="button"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Chat interface
          <div className="flex flex-col h-full">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar" role="log" aria-label="Chat messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} maas-chat-message`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[80%] rounded-lg px-3 md:px-4 py-2 ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                    role="article"
                    aria-label={`Message from ${msg.sender === 'user' ? 'you' : 'assistant'} at ${formatTime(msg.timestamp)}`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 mt-1">
                        {msg.sender === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isGenerating && (
                <div className="flex justify-start maas-chat-message">
                  <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Generating your mock API...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start maas-chat-message">
                  <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-sm ml-2">Assistant is typing...</span>
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
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Ask for modifications or new features..."
                    value={message}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    disabled={isGenerating || isTyping}
                    className="flex-1 min-h-[40px] max-h-[120px] resize-none maas-focus-ring"
                    aria-label="Type your message"
                  />
                  <Button
                    type="submit"
                    disabled={!message.trim() || isGenerating || isTyping}
                    className="maas-focus-ring"
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
        )}
        </CardContent>
      </Card>
    </>
  );
};
