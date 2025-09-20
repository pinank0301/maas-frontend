import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { RightPanel } from './components/RightPanel';
import { useMockGenerator, ApiEndpoint } from './hooks/useMockGenerator';

export const App: React.FC = () => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mockGenerator = useMockGenerator();

  const handleSubmit = async (message: string) => {
    if (!hasSubmitted) {
      setHasSubmitted(true);
      setIsTransitioning(true);
      
      // Trigger layout transition
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }
    
    await mockGenerator.generateMock(message);
  };

  const handleRetry = () => {
    mockGenerator.reset();
  };

  const handleEditEndpoint = (endpoint: ApiEndpoint) => {
    // TODO: Implement endpoint editing
    console.log('Edit endpoint:', endpoint);
  };

  const handleDeleteEndpoint = (endpointId: string) => {
    // TODO: Implement endpoint deletion
    console.log('Delete endpoint:', endpointId);
  };

  const handleAddEndpoint = () => {
    // TODO: Implement adding new endpoint
    console.log('Add new endpoint');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          <div 
            className={`flex gap-6 transition-all duration-400 ease-out ${
              hasSubmitted 
                ? 'flex-col lg:flex-row' 
                : 'flex-col items-center justify-center min-h-[60vh]'
            }`}
          >
            {/* Chat Panel */}
            <div 
              className={`maas-layout-transition ${
                hasSubmitted 
                  ? 'w-full lg:w-[40%]' 
                  : 'w-full max-w-2xl'
              }`}
            >
              <ChatPanel
                onSubmit={handleSubmit}
                isGenerating={mockGenerator.isGenerating}
              />
            </div>

            {/* Right Panel */}
            {hasSubmitted && (
              <div 
                className={`maas-right-panel w-full lg:w-[60%] ${
                  isTransitioning ? 'maas-right-panel-enter' : 'maas-right-panel-enter-active'
                }`}
              >
                <RightPanel
                  state={mockGenerator}
                  onRetry={handleRetry}
                  onEditEndpoint={handleEditEndpoint}
                  onDeleteEndpoint={handleDeleteEndpoint}
                  onAddEndpoint={handleAddEndpoint}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};
