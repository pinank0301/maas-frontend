import { useState, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { Header } from './components/Header'
import { ChatInterface } from './components/ChatInterface'
import { MockPanel } from './components/MockPanel'
import { useMockGeneration } from './hooks/useMockGeneration'
import { Message, Theme } from './types'
import './App.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTransitioned, setIsTransitioned] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')
  const [isMobile, setIsMobile] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(false)
  
  const { isGenerating, mockEndpoints, generateMockEndpoints, getMethodColor } = useMockGeneration()

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Show right panel with delay for smooth animation
  useEffect(() => {
    if (isTransitioned) {
      const timer = setTimeout(() => setShowRightPanel(true), 300)
      return () => clearTimeout(timer)
    }
  }, [isTransitioned])

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date(),
      isUser: true
    }

    setMessages(prev => [...prev, userMessage])
    
    // Trigger layout transition on first message
    if (messages.length === 0) {
      setTimeout(() => setIsTransitioned(true), 100)
    }

    // Generate mock endpoints
    await generateMockEndpoints(message)
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="flex flex-col h-screen">
          {/* Header Component */}
          <Header theme={theme} onToggleTheme={toggleTheme} />
          
          {/* Main Content Layout */}
          <div className={`flex-1 flex transition-all duration-500 ease-in-out ${
            isTransitioned 
              ? (isMobile ? 'flex-col' : 'flex-row') 
              : 'flex-col items-center justify-center'
          }`}>
            {/* Chat Interface Component */}
            <div className={`transition-all duration-500 ease-in-out ${
              isTransitioned 
                ? (isMobile ? 'w-full h-1/2 border-b' : 'w-2/5 border-r') + ' bg-muted/30' 
                : 'w-full max-w-2xl mx-auto'
            }`}>
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isGenerating={isGenerating}
                isTransitioned={isTransitioned}
                isMobile={isMobile}
              />
            </div>

            {/* Mock Panel Component (only shown when transitioned) */}
            {isTransitioned && showRightPanel && (
              <MockPanel
                mockEndpoints={mockEndpoints}
                isGenerating={isGenerating}
                isMobile={isMobile}
                onCopy={copyToClipboard}
                getMethodColor={getMethodColor}
              />
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
