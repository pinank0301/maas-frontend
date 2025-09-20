import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { RightPanel } from './components/RightPanel';
import { useMockGenerator, ApiEndpoint } from './hooks/useMockGenerator';
import { Sparkles, Code, Database, Zap, ArrowRight } from 'lucide-react';

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
                  : 'w-full max-w-4xl'
              }`}
            >
              {!hasSubmitted ? (
                // Hero Section
                <div className="text-center space-y-8 py-8">
                  {/* Main heading */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                      <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                        Generate Mock APIs
                      </h2>
                      <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                      Describe your API requirements and get production-ready mock endpoints 
                      with realistic sample data in seconds.
                    </p>
                  </div>

                  {/* Call to action */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <ArrowRight className="w-4 h-4" />
                      <span>Start by describing your API below</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ) : null}
              
              <ChatPanel
                onSubmit={handleSubmit}
                isGenerating={mockGenerator.isGenerating}
              />

              {!hasSubmitted && (
                // Feature highlights
                <div className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center space-y-3 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                        <Code className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-lg">RESTful APIs</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        Generate complete REST APIs with CRUD operations
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-3 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                        <Database className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-lg">Realistic Data</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        Get authentic sample data that matches your schema
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-3 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-lg">Lightning Fast</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        Generate and deploy mock APIs in under 30 seconds
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
