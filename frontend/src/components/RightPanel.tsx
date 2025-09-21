import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, AlertCircle, Database, Code, Zap, MessageSquare, Play, ChevronDown, ChevronUp } from 'lucide-react';

interface ApiEndpoint {
  id: string;
  chatId: string;
  method: string;
  path: string;
}

interface TestResponse {
  statusCode: number;
  data: {
    chatId: string;
    id: string;
    path: string;
    method: string;
    response: any;
  };
  message: string;
  success: boolean;
}

interface MockGeneratorState {
  isGenerating: boolean;
  progress: number;
  currentStep: string;
  steps: string[];
  endpoints: ApiEndpoint[];
  error: string | null;
}

interface RightPanelProps {
  state: MockGeneratorState;
  onRetry: () => void;
  onEditEndpoint?: (endpoint: ApiEndpoint) => void;
  onDeleteEndpoint?: (endpointId: string) => void;
  onAddEndpoint?: () => void;
  showNoResponse?: boolean;
  className?: string;
}

interface EndpointCardProps {
  endpoint: ApiEndpoint;
  onTest: (endpoint: ApiEndpoint) => void;
  isLoading: boolean;
  testResult?: TestResponse;
}

const EndpointCard: React.FC<EndpointCardProps> = ({ endpoint, onTest, isLoading, testResult }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'POST':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (statusCode >= 400) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-sm font-mono font-medium rounded border ${getMethodColor(endpoint.method)}`}>
              {endpoint.method.toUpperCase()}
            </span>
            <code className="text-sm font-sans font-medium text-gray-800">{`https://mock-api-yo6h.onrender.com/v1/api/mock/${endpoint.chatId}/${endpoint.path}`}</code>
          </div>
          <div className="flex items-center gap-2"> 
            <Button
              onClick={() => onTest(endpoint)}
              disabled={isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Try it out
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Parameters Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Parameters</h4>
            <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
              No parameters
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Response</h4>
              
              {/* Status Code */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Code:</span>
                <span className={`px-2 py-1 text-sm rounded border ${getStatusColor(testResult.statusCode)}`}>
                  {testResult.statusCode}
                </span>
                <span className="text-sm text-gray-600">{testResult.message}</span>
              </div>

              {/* Response Headers */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Response Headers</h5>
                <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                  <div>content-type: application/json</div>
                </div>
              </div>

              {/* Response Body */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Response Body</h5>
                <div className="bg-gray-900 text-gray-100 p-4 rounded text-sm font-mono overflow-auto max-h-64 border">
                  <pre className="whitespace-pre-wrap break-words">{JSON.stringify(testResult.data.response, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const RightPanel: React.FC<RightPanelProps> = ({
  state,
  onRetry,
  onEditEndpoint,
  onDeleteEndpoint,
  onAddEndpoint,
  showNoResponse = false,
  className = '',
}) => {
  const { id: chatId } = useParams<{ id: string }>();
  const [testResults, setTestResults] = useState<Record<string, TestResponse>>({});
  const { isGenerating, progress, currentStep, steps, error } = state;

  // Fetch API endpoints
  const { data: endpoints, isLoading: isLoadingEndpoints, refetch } = useQuery({
    queryKey: ['api-endpoints', chatId],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://mock-api-yo6h.onrender.com/v1/api/mock/fetch-api`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : [];
    },
    enabled: !!chatId,
  });

  // Test API endpoint mutation
  const testEndpointMutation = useMutation({
    mutationFn: async (endpoint: ApiEndpoint) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://mock-api-yo6h.onrender.com/v1/api/mock/${endpoint.chatId}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      setTestResults(prev => ({
        ...prev,
        [variables.id]: data,
      }));
    },
    onError: (error, variables) => {
      console.error('Test API error:', error);
      setTestResults(prev => ({
        ...prev,
        [variables.id]: {
          statusCode: 500,
          data: {
            chatId: variables.chatId,
            id: variables.id,
            path: variables.path,
            method: variables.method,
            response: { error: error.message },
          },
          message: 'Error',
          success: false,
        },
      }));
    },
  });

  const handleTestEndpoint = (endpoint: ApiEndpoint) => {
    testEndpointMutation.mutate(endpoint);
  };

  // Group endpoints by method
  const groupedEndpoints = endpoints?.reduce((acc: Record<string, ApiEndpoint[]>, endpoint: ApiEndpoint) => {
    const method = endpoint.method.toUpperCase();
    if (!acc[method]) acc[method] = [];
    acc[method].push(endpoint);
    return acc;
  }, {}) || {};

  // Show "No Response Generated" when there are no endpoints and no generation in progress
  const showNoResponseState = showNoResponse || ((!endpoints || endpoints.length === 0) && !isGenerating && !error && !isLoadingEndpoints);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error State */}
      {error && (
        <Card className="border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-destructive">Generation Failed</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Generating Mock API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {currentStep && (
                <p className="text-sm text-muted-foreground">{currentStep}</p>
              )}
              {steps.length > 0 && (
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Endpoints */}
      {isLoadingEndpoints ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
              <span className="text-muted-foreground">Loading endpoints...</span>
            </div>
          </CardContent>
        </Card>
      ) : endpoints && endpoints.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                API Endpoints ({endpoints.length})
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Group by HTTP method */}
              {Object.entries(groupedEndpoints).map(([method, methodEndpoints]) => (
                <div key={method} className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide border-b pb-2">
                    {method} Operations
                  </h3>
                  {/* @ts-ignore */}
                  {methodEndpoints.map((endpoint) => (
                    <EndpointCard
                      key={endpoint.id}
                      endpoint={endpoint}
                      onTest={handleTestEndpoint}
                      isLoading={testEndpointMutation.isPending && testEndpointMutation.variables?.id === endpoint.id}
                      testResult={testResults[endpoint.id]}
                    />
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* No Response Generated State */}
      {showNoResponseState && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No API Endpoints</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                No API endpoints have been generated yet. 
                Try asking for specific API endpoints or describing your requirements more clearly.
              </p>
              
              {/* Suggestions */}
              <div className="mt-6 space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-3">Try asking for:</p>
                <div className="grid gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-accent/30 rounded text-left">
                    <Database className="h-3 w-3 text-primary" />
                    <span>"Create a user management API with CRUD operations"</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-accent/30 rounded text-left">
                    <Code className="h-3 w-3 text-primary" />
                    <span>"Generate an e-commerce API with products and orders"</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-accent/30 rounded text-left">
                    <Zap className="h-3 w-3 text-primary" />
                    <span>"Build a blog API with posts and comments"</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Default Empty State (when no chat has started) */}
      {!showNoResponseState && !isGenerating && (!endpoints || endpoints.length === 0) && !error && !isLoadingEndpoints && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Ready to Generate</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Start a conversation to generate realistic mock API endpoints 
                with sample data tailored to your requirements.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};