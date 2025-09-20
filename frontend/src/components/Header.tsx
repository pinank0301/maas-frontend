import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Zap, Github, LogIn, X } from 'lucide-react';
import { LoginForm } from './login-form';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <header className={`relative overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      <div className="relative flex items-center justify-between p-4 lg:p-6">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                MaaS
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Mock as a Service
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative h-8 w-8 rounded-full hover:bg-accent/50 transition-all duration-200"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          
          {/* GitHub link */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-accent/50 transition-all duration-200"
            aria-label="View on GitHub"
          >
            <Github className="h-4 w-4" />
          </Button>
          
          {/* Sign in button */}
          <Button 
            onClick={() => setIsLoginOpen(true)}
            className="rounded-full px-4 py-1.5 text-sm bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <LogIn className="h-3 w-3 mr-1.5" />
            Sign in
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl" />
      
      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Welcome to MaaS
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLoginOpen(false)}
              className="absolute right-4 top-4 h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>
    </header>
  );
};
