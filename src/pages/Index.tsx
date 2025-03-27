
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Home, User, Users, Key } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const handlePortalSelect = (portalType: 'renter' | 'landlord' | 'admin') => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/login/${portalType}`);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="py-20 md:py-32 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Welcome to <span className="text-primary">ResideSync</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 animate-slide-in">
            Simplifying property maintenance for landlords and renters
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <PortalCard
              title="Renter Portal"
              description="Submit and track maintenance requests for your property"
              icon={<User className="h-8 w-8" />}
              onClick={() => handlePortalSelect('renter')}
              isAnimating={isAnimating}
            />
            
            <PortalCard
              title="Landlord Portal"
              description="Manage properties and handle maintenance requests"
              icon={<Key className="h-8 w-8" />}
              onClick={() => handlePortalSelect('landlord')}
              isAnimating={isAnimating}
            />
            
            <PortalCard
              title="Admin Portal"
              description="Provide maintenance bids and manage service requests"
              icon={<Users className="h-8 w-8" />}
              onClick={() => handlePortalSelect('admin')}
              isAnimating={isAnimating}
            />
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-20 px-4 bg-background">
        <div className="container mx-auto text-center max-w-5xl">
          <h2 className="text-3xl font-semibold mb-12">Streamlined Property Maintenance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Easy Request Submission"
              description="Renters can quickly submit maintenance requests with photos and detailed descriptions"
            />
            
            <FeatureCard
              title="Efficient Bid Management"
              description="Landlords can review multiple bids to find the best service providers"
            />
            
            <FeatureCard
              title="Seamless Scheduling"
              description="Coordinate service appointments that work for both renters and service providers"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 ResideSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

interface PortalCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  isAnimating: boolean;
}

const PortalCard: React.FC<PortalCardProps> = ({ title, description, icon, onClick, isAnimating }) => {
  return (
    <Card 
      className={`glass-card flex flex-col items-center p-6 text-center h-full transition-all duration-500 hover:shadow-lg cursor-pointer ${
        isAnimating ? 'animate-scale-out' : 'animate-scale-in'
      }`}
      onClick={onClick}
    >
      <div className="bg-primary/10 p-4 rounded-full mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button className="mt-auto" variant="outline">
        Enter Portal
      </Button>
    </Card>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div className="p-6 rounded-lg bg-secondary/30 flex flex-col items-center text-center">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
