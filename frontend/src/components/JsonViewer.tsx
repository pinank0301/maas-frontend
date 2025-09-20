import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Copy, Check, Download } from 'lucide-react';
import { ApiEndpoint } from '../hooks/useMockGenerator';

interface JsonViewerProps {
  endpoints: ApiEndpoint[];
  className?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ 
  endpoints, 
  className = '' 
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(
    endpoints.length > 0 ? endpoints[0] : null
  );
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = async (text: string, endpointId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [endpointId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [endpointId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadJson = (endpoint: ApiEndpoint) => {
    const dataStr = JSON.stringify(endpoint.response, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${endpoint.path.replace(/\//g, '_')}_${endpoint.method.toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500';
    if (status >= 500) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const formatJson = (obj: any): string => {
    return JSON.stringify(obj, null, 2);
  };

  const highlightJson = (json: string) => {
    return json
      .replace(/"([^"]+)":/g, '<span class="maas-json-key">"$1":</span>')
      .replace(/: "([^"]*)"/g, ': <span class="maas-json-string">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="maas-json-number">$1</span>')
      .replace(/: (true|false)/g, ': <span class="maas-json-boolean">$1</span>')
      .replace(/: null/g, ': <span class="maas-json-null">null</span>');
  };

  if (endpoints.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No endpoints generated yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Endpoint Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">API Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                  selectedEndpoint?.id === endpoint.id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedEndpoint(endpoint)}
              >
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(endpoint.status)} text-white`}
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-mono">{endpoint.path}</code>
                  <span className="text-xs text-muted-foreground">
                    {endpoint.description}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(formatJson(endpoint.response), endpoint.id);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    {copiedStates[endpoint.id] ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadJson(endpoint);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* JSON Response Viewer */}
      {selectedEndpoint && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Response: {selectedEndpoint.method} {selectedEndpoint.path}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(selectedEndpoint.status)} text-white`}
                >
                  {selectedEndpoint.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(formatJson(selectedEndpoint.response), selectedEndpoint.id)}
                >
                  {copiedStates[selectedEndpoint.id] ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy JSON
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="maas-code-block">
              <pre
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: highlightJson(formatJson(selectedEndpoint.response)),
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
