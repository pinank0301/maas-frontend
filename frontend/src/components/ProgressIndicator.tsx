import React from 'react';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { GenerationStep } from '../hooks/useMockGenerator';

interface ProgressIndicatorProps {
  isGenerating: boolean;
  progress: number;
  currentStep: string | null;
  steps: GenerationStep[];
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  isGenerating,
  progress,
  currentStep,
  steps,
  className = '',
}) => {
  if (!isGenerating && steps.length === 0) {
    return null;
  }

  return (
    <Card className={`maas-animate-slide-up ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isGenerating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          <span>
            {isGenerating ? 'Generating Mock API' : 'Generation Complete'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {steps.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Generation Steps</h4>
            <div className="space-y-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    step.id === currentStep
                      ? 'bg-accent'
                      : step.completed
                      ? 'bg-green-50 dark:bg-green-950/20'
                      : 'bg-muted/50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : step.id === currentStep ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{step.title}</p>
                      {step.id === currentStep && (
                        <span className="text-xs text-muted-foreground">
                          {step.progress}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                    
                    {step.id === currentStep && (
                      <div className="mt-2">
                        <Progress value={step.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
