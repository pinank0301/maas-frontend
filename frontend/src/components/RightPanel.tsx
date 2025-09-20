import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, AlertCircle, Database, Code, Zap, MessageSquare } from 'lucide-react';

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

interface RightPanelProps {
  state: MockGeneratorState;
  onRetry: () => void;
  onEditEndpoint?: (endpoint: ApiEndpoint) => void;
  onDeleteEndpoint?: (endpointId: string) => void;
  onAddEndpoint?: () => void;
  showNoResponse?: boolean;
  className?: string;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  state,
  onRetry,
  onEditEndpoint,
  onDeleteEndpoint,
  onAddEndpoint,
  showNoResponse = false,
  className = '',
}) => {
  const { isGenerating, progress, currentStep, steps, endpoints, error } = state;

  // Show "No Response Generated" when there are no endpoints and no generation in progress
  const showNoResponseState = showNoResponse || (endpoints.length === 0 && !isGenerating && !error);

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

      {/* Endpoints List */}
      {endpoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Generated Endpoints ({endpoints.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {endpoints.map((endpoint) => (
                <div
                  key={endpoint.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-mono rounded ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                        endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono">{endpoint.path}</code>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      endpoint.statusCode === 200 ? 'bg-green-100 text-green-800' :
                      endpoint.statusCode < 400 ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {endpoint.statusCode}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                  
                  {/* Response Preview */}
                  <div className="mt-3">
                    <p className="text-xs font-medium mb-1">Response:</p>
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(endpoint.responseBody, null, 2).slice(0, 200)}
                      {JSON.stringify(endpoint.responseBody, null, 2).length > 200 && '...'}
                    </pre>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditEndpoint?.(endpoint)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteEndpoint?.(endpoint.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Add Endpoint Button */}
              <Button
              // @ts-ignore
                variant="dashed"
                className="w-full"
                onClick={onAddEndpoint}
              >
                + Add Endpoint
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Response Generated State */}
      {showNoResponseState && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No Response Generated</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                The assistant hasn't generated any mock API data yet. 
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
      {!showNoResponseState && !isGenerating && endpoints.length === 0 && !error && (
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