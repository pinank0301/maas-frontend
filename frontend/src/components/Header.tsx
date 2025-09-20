import React, { useState } from 'react';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Menu, X, LogOut, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleSignInClick = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    navigate('/login');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Check if we're on a chat page
  const isChatPage = location.pathname.includes('/chat/');

  return (
    <header className={`relative overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 lg:p-6">
        {/* Back to Home button for chat pages */}
        {isChatPage && (
          <div className="flex items-center">
            <Button
              onClick={handleBackToHome}
              variant="ghost"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </div>
        )}

        {/* Spacer for non-chat pages */}
        {!isChatPage && <div></div>}

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
        
        {/* Auth buttons */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.fullName}</span>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="rounded-full px-4 py-2 text-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleSignInClick}
            className="rounded-full px-6 py-2 text-sm bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign in
          </Button>
        )}
      </div>

      {/* Mobile Navigation Menu - Empty now but keeping structure */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-sm">
          <nav className="flex flex-col space-y-1 p-4">
            {/* Navigation items removed */}
          </nav>
        </div>
      )}
    </header>
  );
};