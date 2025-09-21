import React, { useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Header } from '../components/Header';
import { Sparkles, Code, Database, Zap, ArrowRight } from 'lucide-react';

// Function to generate a random UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const HomePage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerateMockAPI = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    setIsGenerating(true);

    try {
      // 1. Generate a random UUID
      const chatId = generateUUID();
      
      // 2. Save the user input message in localStorage
      localStorage.setItem(`chat_${chatId}_message`, message.trim());
      
      // 3. Redirect user to /chat/:chatid page
      window.location.href = `/chat/${chatId}`;
      
    } catch (error) {
      console.error('Error creating chat:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to create chat'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-4xl">
              {/* Hero Section */}
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

                {/* Input and Button */}
                <div className="space-y-4 max-w-2xl mx-auto">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your API requirements..."
                    className="w-full p-4 border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                    disabled={isGenerating}
                  />
                  
                  <button
                    onClick={handleGenerateMockAPI}
                    disabled={isGenerating || !message.trim()}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Mock API'}
                  </button>
                </div>

                {/* Call to action */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <ArrowRight className="w-4 h-4" />
                    <span>Start by describing your API above</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Feature highlights */}
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
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};