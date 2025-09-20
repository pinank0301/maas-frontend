import React, { useState } from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { LogIn, Menu, X, Home, Star, Info } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  className = ''
}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items
  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: <Home className="w-4 h-4" />,
      action: () => navigate('/')
    },
    {
      label: 'Features',
      href: '#features',
      icon: <Star className="w-4 h-4" />,
      action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      label: 'About',
      href: '#about',
      icon: <Info className="w-4 h-4" />,
      action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    }
  ];

  const handleSignInClick = () => {
    navigate('/login');
  };

  const handleNavClick = (item: any) => {
    if (item.action) {
      item.action();
    } else if (item.href.startsWith('/')) {
      navigate(item.href);
    } else {
      window.location.href = item.href;
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`relative overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 lg:p-6">
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => handleNavClick(item)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
            >
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden h-8 w-8 rounded-full hover:bg-accent/50 transition-all duration-200"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
        
        {/* Sign in button */}
        <Button 
          onClick={handleSignInClick}
          className="rounded-full px-6 py-2 text-sm bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign in
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-sm">
          <nav className="flex flex-col space-y-1 p-4">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => handleNavClick(item)}
                className="flex items-center space-x-3 px-3 py-3 text-left justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                <span className="font-medium">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
