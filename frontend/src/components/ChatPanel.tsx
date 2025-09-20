import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Send, Loader2 } from 'lucide-react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isGenerating) {
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

  useEffect(() => {
    // Focus textarea on mount
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <Card className={`maas-chat-panel ${className}`}>
      <CardContent className="p-6">
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
              disabled={isGenerating}
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
              ) : (
                <span>Ready to generate mock APIs</span>
              )}
            </div>

            <Button
              type="submit"
              disabled={!message.trim() || isGenerating}
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
      </CardContent>
    </Card>
  );
};
