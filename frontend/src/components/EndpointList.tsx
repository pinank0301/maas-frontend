import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { ApiEndpoint } from '../hooks/useMockGenerator';

interface EndpointListProps {
  endpoints: ApiEndpoint[];
  onEditEndpoint?: (endpoint: ApiEndpoint) => void;
  onDeleteEndpoint?: (endpointId: string) => void;
  onAddEndpoint?: () => void;
  className?: string;
}

export const EndpointList: React.FC<EndpointListProps> = ({
  endpoints,
  onEditEndpoint,
  onDeleteEndpoint,
  onAddEndpoint,
  className = '',
}) => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500';
    if (status >= 500) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500';
      case 'POST': return 'bg-green-500';
      case 'PUT': return 'bg-yellow-500';
      case 'DELETE': return 'bg-red-500';
      case 'PATCH': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: number) => {
    if (status >= 200 && status < 300) return 'Success';
    if (status >= 400 && status < 500) return 'Client Error';
    if (status >= 500) return 'Server Error';
    return 'Unknown';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Generated Endpoints</CardTitle>
          {onAddEndpoint && (
            <Button
              onClick={onAddEndpoint}
              size="sm"
              className="maas-focus-ring"
              aria-label="Add new endpoint"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Endpoint
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {endpoints.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              <ExternalLink className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No endpoints generated yet</p>
              <p className="text-sm">Submit a request to generate mock API endpoints</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors maas-hover-lift"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Badge 
                    variant="secondary" 
                    className={`${getMethodColor(endpoint.method)} text-white font-mono text-xs`}
                  >
                    {endpoint.method}
                  </Badge>
                  
                  <div className="flex-1 min-w-0">
                    <code className="text-sm font-mono text-foreground block truncate">
                      {endpoint.path}
                    </code>
                    <p className="text-xs text-muted-foreground mt-1">
                      {endpoint.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(endpoint.status)} text-white text-xs`}
                    >
                      {endpoint.status} {getStatusText(endpoint.status)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-1 ml-4">
                  {onEditEndpoint && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditEndpoint(endpoint)}
                      className="h-8 w-8 p-0 maas-focus-ring"
                      aria-label={`Edit ${endpoint.method} ${endpoint.path}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onDeleteEndpoint && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteEndpoint(endpoint.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive maas-focus-ring"
                      aria-label={`Delete ${endpoint.method} ${endpoint.path}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {endpoints.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''} generated</span>
              <div className="flex items-center space-x-4">
                <span>Ready to use</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs">Live</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
