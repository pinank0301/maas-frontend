import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Header } from '../components/Header';
import { ChatPanel } from '../components/ChatPanel';
import { RightPanel } from '../components/RightPanel';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ApiEndpoint {
  id: string;
  method: string;
  path: string;
  description: string;
  requestBody?: any;
  responseBody: any;
  statusCode: number;
}

interface MockGeneratorState {
  isGenerating: boolean;
  progress: number;
  currentStep: string;
  steps: string[];
  endpoints: ApiEndpoint[];
  error: string | null;
}

const ChatPage: React.FC = () => {
  const { id: chatId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [chatTitle, setChatTitle] = useState('');
  const [mockState, setMockState] = useState<MockGeneratorState>({
    isGenerating: false,
    progress: 0,
    currentStep: '',
    steps: [],
    endpoints: [],
    error: null
  });

  // Fetch chat messages on component mount
  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!chatId) return;
      
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Fetch chat messages
        const messagesResponse = await fetch(`https://mock-api-2p6p.onrender.com/v1/api/chat/${chatId}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          if (messagesData.success) {
            setMessages(messagesData.data.messages || []);
            setChatTitle(messagesData.data.title || `Chat ${chatId.slice(0, 8)}...`);
          }
        }

        // Fetch mock data
        const mockResponse = await fetch(`https://mock-api-2p6p.onrender.com/v1/api/chat/${chatId}/mock-data`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (mockResponse.ok) {
          const mockData = await mockResponse.json();
          if (mockData.success && mockData.data.endpoints) {
            setMockState(prev => ({
              ...prev,
              endpoints: mockData.data.endpoints,
              steps: mockData.data.steps || []
            }));
          }
        }

      } catch (error) {
        console.error('Error fetching chat data:', error);
        setMockState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to load chat data'
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatMessages();
  }, [chatId]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isSending || !chatId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);
    setMockState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`https://mock-api-2p6p.onrender.com/v1/api/chat/${chatId}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Add assistant response
        if (data.data.response) {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: data.data.response,
            sender: 'assistant',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
        }

        // Update mock data if provided
        if (data.data.mockData) {
          setMockState(prev => ({
            ...prev,
            endpoints: data.data.mockData.endpoints || [],
            steps: data.data.mockData.steps || []
          }));
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMockState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send message'
      }));
    } finally {
      setIsSending(false);
      setMockState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleRetry = () => {
    // Retry last user message
    const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6">
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading chat...</p>
              </div>
            </div>
          </main>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-6">
          {/* Chat Title */}
          {chatTitle && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{chatTitle}</h1>
            </div>
          )}

          {/* Chat Content */}
          <div className="flex gap-6">
            {/* Left Panel - Chat */}
            <div className="w-full lg:w-1/2">
              <ChatPanel
                messages={messages}
                onSubmit={handleSendMessage}
                isGenerating={isSending}
              />
            </div>

            {/* Right Panel - Mock Data */}
            <div className="w-full lg:w-1/2">
              <RightPanel
                state={mockState}
                onRetry={handleRetry}
                onEditEndpoint={(endpoint) => {
                  console.log('Edit endpoint:', endpoint);
                }}
                onDeleteEndpoint={(endpointId) => {
                  console.log('Delete endpoint:', endpointId);
                }}
                onAddEndpoint={() => {
                  console.log('Add endpoint');
                }}
                showNoResponse={messages.length > 0 && mockState.endpoints.length === 0 && !mockState.isGenerating}
              />
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default ChatPage;