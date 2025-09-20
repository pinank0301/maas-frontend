import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Send, Loader2 } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isGenerating: boolean
  isTransitioned: boolean
  isMobile: boolean
}

export function ChatInput({ onSendMessage, isGenerating, isTransitioned, isMobile }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (!inputValue.trim()) return
    onSendMessage(inputValue)
    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className={`${isTransitioned ? 'p-4 border-t' : 'w-full'} ${isMobile ? 'mobile-padding' : ''}`}>
      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Describe the API you want to mock..."
          className="flex-1 focus-visible"
          onKeyPress={handleKeyPress}
          aria-label="Describe the API you want to mock"
        />
        <Button 
          onClick={handleSend}
          disabled={!inputValue.trim() || isGenerating}
          size="sm"
          aria-label="Send message"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
