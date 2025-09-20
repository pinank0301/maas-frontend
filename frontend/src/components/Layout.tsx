import { ChatInterface } from './ChatInterface'
import { MockPanel } from './MockPanel'
import { Message, MockEndpoint } from '../types'

interface LayoutProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isGenerating: boolean
  isTransitioned: boolean
  isMobile: boolean
  showRightPanel: boolean
  mockEndpoints: MockEndpoint[]
  onCopy: (text: string) => void
  getMethodColor: (method: string) => string
}

export function Layout({
  messages,
  onSendMessage,
  isGenerating,
  isTransitioned,
  isMobile,
  showRightPanel,
  mockEndpoints,
  onCopy,
  getMethodColor
}: LayoutProps) {
  return (
    <div className={`flex-1 flex transition-all duration-500 ease-in-out ${
      isTransitioned 
        ? (isMobile ? 'flex-col' : 'flex-row') 
        : 'flex-col items-center justify-center'
    }`}>
      {/* Chat Interface */}
      <div className={`transition-all duration-500 ease-in-out ${
        isTransitioned 
          ? (isMobile ? 'w-full h-1/2 border-b' : 'w-2/5 border-r') + ' bg-muted/30' 
          : 'w-full max-w-2xl mx-auto'
      }`}>
        <ChatInterface
          messages={messages}
          onSendMessage={onSendMessage}
          isGenerating={isGenerating}
          isTransitioned={isTransitioned}
          isMobile={isMobile}
        />
      </div>

      {/* Right Panel (only shown when transitioned) */}
      {isTransitioned && showRightPanel && (
        <MockPanel
          mockEndpoints={mockEndpoints}
          isGenerating={isGenerating}
          isMobile={isMobile}
          onCopy={onCopy}
          getMethodColor={getMethodColor}
        />
      )}
    </div>
  )
}
