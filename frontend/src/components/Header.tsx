import React from 'react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { theme} = useTheme();

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
          <Button>Sign in</Button>
        </div>
        <span className="text-sm text-muted-foreground sr-only">
          {theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
        </span>
      </div>
    </header>
  );
};
