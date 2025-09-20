import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { HeroSection } from './HeroSection'
import { Message } from '../types'

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isGenerating: boolean
  isTransitioned: boolean
  isMobile: boolean
}

export function ChatInterface({ 
  messages, 
  onSendMessage, 
  isGenerating, 
  isTransitioned, 
  isMobile 
}: ChatInterfaceProps) {
  return (
    <div className={`${isTransitioned ? 'h-full flex flex-col' : 'text-center space-y-8'}`}>
      {/* Hero Section (only shown when not transitioned) */}
      {!isTransitioned && (
        <HeroSection>
          <ChatInput
            onSendMessage={onSendMessage}
            isGenerating={isGenerating}
            isTransitioned={isTransitioned}
            isMobile={isMobile}
          />
        </HeroSection>
      )}

      {/* Messages */}
      <div className={`flex-1 ${isTransitioned ? 'p-4 space-y-4 overflow-y-auto custom-scrollbar' : 'space-y-4'} ${isMobile ? 'mobile-padding' : ''}`}>
        <MessageList messages={messages} />
      </div>

      {/* Input Area (only shown when transitioned) */}
      {isTransitioned && (
        <ChatInput
          onSendMessage={onSendMessage}
          isGenerating={isGenerating}
          isTransitioned={isTransitioned}
          isMobile={isMobile}
        />
      )}
    </div>
  )
}
