import React from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { EndpointList } from './EndpointList';
import { JsonViewer } from './JsonViewer';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { MockGeneratorState, ApiEndpoint } from '../hooks/useMockGenerator';

interface RightPanelProps {
  state: MockGeneratorState;
  onRetry: () => void;
  onEditEndpoint?: (endpoint: ApiEndpoint) => void;
  onDeleteEndpoint?: (endpointId: string) => void;
  onAddEndpoint?: () => void;
  className?: string;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  state,
  onRetry,
  onEditEndpoint,
  onDeleteEndpoint,
  onAddEndpoint,
  className = '',
}) => {
  const { isGenerating, progress, currentStep, steps, endpoints, error } = state;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="maas-animate-slide-up">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="ml-4 maas-focus-ring"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Indicator */}
      {(isGenerating || steps.length > 0) && (
        <ProgressIndicator
          isGenerating={isGenerating}
          progress={progress}
          currentStep={currentStep}
          steps={steps}
        />
      )}

      {/* Endpoints List */}
      {endpoints.length > 0 && (
        <EndpointList
          endpoints={endpoints}
          onEditEndpoint={onEditEndpoint}
          onDeleteEndpoint={onDeleteEndpoint}
          onAddEndpoint={onAddEndpoint}
        />
      )}

      {/* JSON Viewer */}
      {endpoints.length > 0 && (
        <JsonViewer endpoints={endpoints} />
      )}

      {/* Empty State */}
      {!isGenerating && endpoints.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <RefreshCw className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">Ready to Generate</h3>
            <p className="text-sm max-w-md mx-auto">
              Describe your API requirements in the chat panel to generate 
              realistic mock endpoints with sample data.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
