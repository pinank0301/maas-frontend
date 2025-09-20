import { Button } from './ui/button'
import { Zap, Moon, Sun } from 'lucide-react'

interface HeaderProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center space-x-2">
        <Zap className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">MaaS</h1>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleTheme}
        className="p-2"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>
    </header>
  )
}
