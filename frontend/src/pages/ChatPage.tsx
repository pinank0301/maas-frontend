import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

interface ApiMessage {
  id: string;
  chatId: string;
  content: string;
  role: 'USER' | 'ASSISTANT';
  status: 'COMPLETED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
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

interface FetchMessagesResponse {
  statusCode: number;
  data: ApiMessage[];
  message: string;
  success: boolean;
}

interface GenerateResponse {
  statusCode: number;
  data: {
    modelMessage: string;
  };
  message: string;
  success: boolean;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Fetch messages function
const fetchMessages = async (chatId: string): Promise<FetchMessagesResponse> => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/chat/fetch-msg?chatId=${chatId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Generate chat function
const generateChat = async (chatId: string, message: string): Promise<GenerateResponse> => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/message/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chatId,
      message,
      role: 'USER'
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Convert API message to ChatMessage
const convertToMessage = (apiMessage: ApiMessage): ChatMessage => ({
  id: apiMessage.id,
  content: apiMessage.content,
  sender: apiMessage.role === 'USER' ? 'user' : 'assistant',
  timestamp: new Date(apiMessage.createdAt)
});

const ChatPageContent: React.FC = () => {
  const { id: chatId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [chatTitle, setChatTitle] = useState('');
  const [mockState, setMockState] = useState<MockGeneratorState>({
    isGenerating: false,
    progress: 0,
    currentStep: '',
    steps: [],
    endpoints: [],
    error: null
  });

  // Fetch messages using React Query
  const { data: messagesData, isLoading, error } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => fetchMessages(chatId!),
    enabled: !!chatId,
    refetchOnMount: true
  });

  // Generate mutation
  const generateMutation = useMutation({
    mutationFn: ({ chatId, message }: { chatId: string, message: string }) => 
      generateChat(chatId, message),
    onSuccess: (data) => {
      // Remove message from localStorage
      localStorage.removeItem(`chat_${chatId}_message`);
      
      // Refetch messages to get the updated list
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
    onError: (error) => {
      console.error('Generate error:', error);
      setMockState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to generate response'
      }));
    }
  });

  // Send new message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ chatId, message }: { chatId: string, message: string }) => 
      generateChat(chatId, message),
    onSuccess: (data) => {
      // Refetch messages to get the updated list
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
    onError: (error) => {
      console.error('Send message error:', error);
      setMockState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send message'
      }));
    }
  });

  // Check for initial message and generate if no data exists
  useEffect(() => {
    if (messagesData && chatId) {
      // Check if we have no messages and there's a stored message
      if (messagesData.data.length === 0) {
        const storedMessage = localStorage.getItem(`chat_${chatId}_message`);
        if (storedMessage && !generateMutation.isPending) {
          generateMutation.mutate({ chatId, message: storedMessage });
        }
      }
      
      // Set chat title
      if (messagesData.data.length > 0) {
        setChatTitle(`Chat ${chatId.slice(0, 8)}...`);
      }
    }
  }, [messagesData, chatId]);

  // Convert API messages to chat messages
  const messages: ChatMessage[] = messagesData?.data.map(convertToMessage) || [];

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || sendMessageMutation.isPending || !chatId) return;

    // Optimistically add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    // Update the query cache optimistically
    queryClient.setQueryData(['messages', chatId], (oldData: FetchMessagesResponse | undefined) => {
      if (!oldData) return oldData;
      
      const newApiMessage: ApiMessage = {
        id: userMessage.id,
        chatId: chatId,
        content: userMessage.content,
        role: 'USER',
        status: 'PENDING',
        createdAt: userMessage.timestamp.toISOString(),
        updatedAt: userMessage.timestamp.toISOString()
      };

      return {
        ...oldData,
        data: [...oldData.data, newApiMessage]
      };
    });

    setMockState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      await sendMessageMutation.mutateAsync({ chatId, message: message.trim() });
    } catch (error) {
      // Remove the optimistic update on error
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    } finally {
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

  if (!chatId) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-full min-h-[60vh]">
            <div className="text-center">
              <p className="text-muted-foreground">Invalid chat ID</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-full min-h-[60vh]">
            <div className="text-center">
              <p className="text-red-500">Error loading chat: {error.message}</p>
              <button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['messages', chatId] })}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Chat Title */}
        {/* {chatTitle && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{chatTitle}</h1>
          </div>
        )} */}

        {/* Chat Content */}
        <div className="flex gap-6">
          {/* Left Panel - Chat */}
          <div className="w-full lg:w-1/2">
            <ChatPanel
              messages={messages}
              onSubmit={handleSendMessage}
              isGenerating={sendMessageMutation.isPending || generateMutation.isPending}
            />
          </div>

          {/* Right Panel - Mock Data */}
          <div className="w-full lg:w-1/2">
            <RightPanel
            // @ts-ignore
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
              // showNoResponse={messages.length > 0 && mockState.endpoints.length === 0 && !mockState.isGenerating}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const ChatPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ChatPageContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default ChatPage;