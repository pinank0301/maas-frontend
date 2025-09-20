import React from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`flex items-center justify-between p-6 ${className}`}>
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold text-foreground">
          MaaS - Mock as a Service
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Generate realistic API mocks instantly. Describe your API requirements and get 
          production-ready mock endpoints with sample data.
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4" />
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
            aria-label="Toggle dark mode"
            className="maas-focus-ring"
          />
          <Moon className="h-4 w-4" />
        </div>
        <span className="text-sm text-muted-foreground sr-only">
          {theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
        </span>
      </div>
    </header>
  );
};
