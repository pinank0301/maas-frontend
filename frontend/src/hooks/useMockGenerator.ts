import { useState, useCallback } from 'react';

export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: number;
  response: any;
  description: string;
}

export interface GenerationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
}

export interface MockGeneratorState {
  isGenerating: boolean;
  progress: number;
  currentStep: string | null;
  steps: GenerationStep[];
  endpoints: ApiEndpoint[];
  error: string | null;
}

const INITIAL_STATE: MockGeneratorState = {
  isGenerating: false,
  progress: 0,
  currentStep: null,
  steps: [],
  endpoints: [],
  error: null,
};

export const useMockGenerator = () => {
  const [state, setState] = useState<MockGeneratorState>(INITIAL_STATE);

  const generateMock = useCallback(async (description: string) => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      progress: 0,
      currentStep: null,
      error: null,
      endpoints: [],
    }));

    // Define generation steps
    const steps: GenerationStep[] = [
      {
        id: 'analyze',
        title: 'Analyzing Requirements',
        description: 'Understanding your API requirements...',
        completed: false,
        progress: 0,
      },
      {
        id: 'design',
        title: 'Designing Endpoints',
        description: 'Creating RESTful endpoint structure...',
        completed: false,
        progress: 0,
      },
      {
        id: 'schema',
        title: 'Generating Schemas',
        description: 'Creating data models and validation rules...',
        completed: false,
        progress: 0,
      },
      {
        id: 'mock-data',
        title: 'Generating Mock Data',
        description: 'Creating realistic sample responses...',
        completed: false,
        progress: 0,
      },
      {
        id: 'finalize',
        title: 'Finalizing API',
        description: 'Preparing endpoints for use...',
        completed: false,
        progress: 0,
      },
    ];

    setState(prev => ({ ...prev, steps }));

    try {
      // Simulate step-by-step generation
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        setState(prev => ({
          ...prev,
          currentStep: step.id,
          steps: prev.steps.map(s => 
            s.id === step.id 
              ? { ...s, completed: false, progress: 0 }
              : s
          ),
        }));

        // Simulate progress within each step
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          
          setState(prev => ({
            ...prev,
            progress: ((i * 100) + progress) / steps.length,
            steps: prev.steps.map(s => 
              s.id === step.id 
                ? { ...s, progress }
                : s
            ),
          }));
        }

        // Mark step as completed
        setState(prev => ({
          ...prev,
          steps: prev.steps.map(s => 
            s.id === step.id 
              ? { ...s, completed: true, progress: 100 }
              : s
          ),
        }));
      }

      // Generate mock endpoints based on description
      const mockEndpoints = generateMockEndpoints(description);
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        progress: 100,
        currentStep: null,
        endpoints: mockEndpoints,
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate mock API',
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    ...state,
    generateMock,
    reset,
  };
};

// Helper function to generate mock endpoints based on description
const generateMockEndpoints = (description: string): ApiEndpoint[] => {
  const keywords = description.toLowerCase();
  
  // Simple keyword-based endpoint generation
  const endpoints: ApiEndpoint[] = [];

  if (keywords.includes('user') || keywords.includes('auth')) {
    endpoints.push({
      id: '1',
      path: '/api/users',
      method: 'GET',
      status: 200,
      description: 'Get all users',
      response: {
        users: [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        ],
        total: 2,
        page: 1,
        limit: 10,
      },
    });

    endpoints.push({
      id: '2',
      path: '/api/users',
      method: 'POST',
      status: 201,
      description: 'Create a new user',
      response: {
        id: 3,
        name: 'New User',
        email: 'newuser@example.com',
        role: 'user',
        createdAt: '2024-01-15T10:30:00Z',
      },
    });
  }

  if (keywords.includes('product') || keywords.includes('item')) {
    endpoints.push({
      id: '3',
      path: '/api/products',
      method: 'GET',
      status: 200,
      description: 'Get all products',
      response: {
        products: [
          { 
            id: 1, 
            name: 'Laptop Pro', 
            price: 1299.99, 
            category: 'Electronics',
            inStock: true,
            rating: 4.5,
          },
          { 
            id: 2, 
            name: 'Wireless Mouse', 
            price: 29.99, 
            category: 'Accessories',
            inStock: true,
            rating: 4.2,
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      },
    });
  }

  if (keywords.includes('order') || keywords.includes('purchase')) {
    endpoints.push({
      id: '4',
      path: '/api/orders',
      method: 'GET',
      status: 200,
      description: 'Get user orders',
      response: {
        orders: [
          {
            id: 'ORD-001',
            userId: 1,
            items: [
              { productId: 1, quantity: 1, price: 1299.99 },
            ],
            total: 1299.99,
            status: 'completed',
            createdAt: '2024-01-15T10:30:00Z',
          },
        ],
        total: 1,
      },
    });
  }

  // Default endpoints if no specific keywords found
  if (endpoints.length === 0) {
    endpoints.push({
      id: '1',
      path: '/api/data',
      method: 'GET',
      status: 200,
      description: 'Get sample data',
      response: {
        message: 'Hello from your mock API!',
        timestamp: new Date().toISOString(),
        data: {
          id: 1,
          name: 'Sample Item',
          value: 42,
        },
      },
    });
  }

  return endpoints;
};
