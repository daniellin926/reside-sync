
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { LogOut, User, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PortalLayoutProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children, title, className }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-card z-10 sticky top-0 border-b border-slate-200 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center h-16 px-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(`/${user.role}`)}
              className="flex items-center text-xl font-semibold hover:opacity-80 transition-opacity"
            >
              <Home className="w-5 h-5 mr-2" />
              ResideSync
            </button>
          </div>
          <h1 className="text-xl font-medium">{title}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user.name}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="rounded-full" 
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={cn("flex-1 py-8 px-4", className)}>
        <div className="container mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-sm text-slate-500">
        <div className="container mx-auto">
          <p>© 2023 ResideSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PortalLayout;
